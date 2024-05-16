import json
import time
import uuid
from environs import Env
from datetime import datetime
from typing import TYPE_CHECKING, List

from coding_assistant.assistant.models import (
    AssistantMessageItem,
    AssistantMessageValue,
)
from coding_assistant.assistant.schemas import (
    AssistantEntity,
    AssistantThreadEntity,
    Role,
    AssistantMessageType,
)
from coding_assistant.llms.llm import LLM
from openai import AzureOpenAI
from coding_assistant.connections.azureopenaix import AzureOpenAiConfig
from openai.types.beta.threads import Run 
from .constants import WRAPPER_PROMPT

class AzureOpenAILLM(LLM):
    def __init__(self, client: AzureOpenAI):
        
        self.client = client
        
        # set default values
        self.API_TIMEOUT = 10
        self.RUN = {
            "TERMINAL_STATES": ["expired", "completed", "failed", "cancelled"],
            "PENDING_STATES": ["queued", "in_progress", "cancelling"],
            "ACTION_STATES": ["requires_action"],
        }

    

    async def create_assistant(
        self, name: str, instructions: str, model: str
    ) -> AssistantEntity:
        openai_assistant = self.client.beta.assistants.create(
            name=name,
            instructions=instructions,
            tools=[],
            model=model,
        )
        assistant = AssistantEntity(
            id=openai_assistant.id,
            name=openai_assistant.name,
            created_at=datetime.fromtimestamp(openai_assistant.created_at),
            instructions=openai_assistant.instructions,
            model=openai_assistant.model,
        )
        return assistant

    async def delete_assistant(self, assistant_id: str):
        try:
            self.client.beta.assistants.delete(
                assistant_id=assistant_id, timeout=self.API_TIMEOUT
            )
        except Exception as e:
            print(f"[{self.__class__.__name__}: delete_assistant]: {e}")
        return

    async def create_thread(
        self, assistant_id: str, default_name: str
    ) -> AssistantThreadEntity:
        openai_thread = self.client.beta.threads.create(
            timeout=self.API_TIMEOUT
        )
        thread = AssistantThreadEntity(
            id=openai_thread.id,
            name=default_name,
            assistant_id=assistant_id,
            created_at=datetime.fromtimestamp(openai_thread.created_at),
        )
        return thread

    async def delete_thread(self, thread_id: str):
        try:
            self.client.beta.threads.delete(thread_id, timeout=self.API_TIMEOUT)
        except Exception as e:
            print(f"[{self.__class__.__name__}: delete_thread]: {e}")
        return

    async def process_user_message(
        self,
        assistant: AssistantEntity,
        thread_id: str,
        message: str,
    ) -> List[AssistantMessageItem]:
        user_message: AssistantMessageItem = await self._send_message(
            thread_id, message
        )
        responses: List[AssistantMessageItem] | None = await self._get_response(
            assistant_id=assistant.id,
            thread_id=thread_id,
        )
        # if there is something wrong with the thread. TODO !!!IMPORTANT!!!: remove thread from assistants
        if responses is None:
            responses: List[AssistantMessageItem] = [
                AssistantMessageItem(
                    id=f"internal_{str(uuid.uuid4())}",
                    role=Role.Assistant,
                    created_at=datetime.now(),
                    value=AssistantMessageValue(
                        type=AssistantMessageType.Text,
                        content={
                            "message": "There is something wrong with this particular chat. Please, start a new chat."
                        },
                    ),
                )
            ]

        user_message_and_responses = [user_message] + responses
        return user_message_and_responses


    async def _send_message(
        self, thread_id: str, message: str
    ) -> AssistantMessageItem:
        runs = self.client.beta.threads.runs.list(
            thread_id, timeout=self.API_TIMEOUT
        )
        if len(runs.data) > 0:
            run = runs.data[0]
            if run.status not in self.RUN["TERMINAL_STATES"]:
                print(
                    f"[{self.__class__.__name__} _send_message] Existing run: {run.id}, status: {run.status}"
                )
                try:
                    self.client.beta.threads.runs.cancel(
                        thread_id=thread_id,
                        run_id=run.id,
                        timeout=self.API_TIMEOUT,
                    )
                except Exception as e:
                    print(
                        f"[{self.__class__.__name__} _send_message] Error cancelling the run: {e}"
                    )
                await self._wait_on_run(thread_id, run)
                print(
                    f"[{self.__class__.__name__} _send_message] After wait | Existing run: {run.id}, status: {run.status}"
                )

        wrapped_message = WRAPPER_PROMPT + message
                             
        thread_message = self.client.beta.threads.messages.create(
            thread_id,
            role="user",
            content=wrapped_message,
            timeout=self.API_TIMEOUT,
        )
        print(f"[{self.__class__.__name__} _send_message] Sent a message")

        user_message = AssistantMessageItem(
            id=thread_message.id,
            role=Role.User,
            created_at=datetime.now(),
            value=AssistantMessageValue(
                type=AssistantMessageType.Text, content={"message": message}
            ),
        )

        return user_message

    async def _wait_on_run(self, thread_id: str, run: Run) -> Run:
        print(
            f"[{self.__class__.__name__} _wait_on_run] before id: {run.id} status: {run.status}, error: {run.last_error}"
        )
        itr = 0
        MAX_ITR = 120
        while run.status in self.RUN["PENDING_STATES"] and itr <= MAX_ITR:
            itr += 1
            print(
                f"[{self.__class__.__name__} _wait_on_run] waiting for id: {run.id} status: {run.status}, error: {run.last_error}"
            )
            run = self.client.beta.threads.runs.retrieve(
                thread_id=thread_id, run_id=run.id, timeout=self.API_TIMEOUT
            )
            time.sleep(0.5)
        print(
            f"[{self.__class__.__name__} _wait_on_run] after id: {run.id} status: {run.status}, error: {run.last_error}"
        )

        if itr > MAX_ITR:
            try:
                print(
                    f"[{self.__class__.__name__} _wait_on_run] Cancelling the run {run.id}, itr: {itr}"
                )
                self.client.beta.threads.runs.cancel(
                    thread_id=thread_id, run_id=run.id, timeout=self.API_TIMEOUT
                )
            except Exception as e:
                print(
                    f"[{self.__class__.__name__} _wait_on_run] Error cancelling the run: {e}"
                )
                run.status = "cancelled"

        return run

    async def _get_response(
        self,
        assistant_id: str,
        thread_id: str,
    ) -> List[AssistantMessageItem] | None:
        # creating a run
        run = self.client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id,
            timeout=self.API_TIMEOUT,
        )

        # set itearions
        itr = 0
        MAX_ITR = 10

        # set frontend_outputs
        frontend_outputs: List[AssistantMessageItem] = []

        # processing the run with or without actions
        while (
            run := await self._wait_on_run(thread_id, run)
        ).status not in self.RUN["TERMINAL_STATES"] and itr <= MAX_ITR:
            itr += 1
            print(
                f"[{self.__class__.__name__} _get_response] run.status: {run.status}"
            )

        if itr > MAX_ITR:
            return None

        # prepare the final message from the OpenAI Assistant
        messages = self.client.beta.threads.messages.list(
            thread_id=thread_id,
            timeout=self.API_TIMEOUT,
        )
        assistant_message = messages.data[0]

        # for each message, create a value wrapper. TODO: Process content.test is None = MessageContentImageFile or other file/json/etc.
        if assistant_message.role == "assistant":
            for content in assistant_message.content:
                if content.text is not None:
                    assistant_frontent_output = AssistantMessageItem(
                        id=assistant_message.id,
                        role=Role.Assistant,
                        created_at=datetime.now(),
                        value=AssistantMessageValue(
                            type=AssistantMessageType.Text,
                            content={"message": content.text.value},
                        ),
                    )
                    frontend_outputs.append(assistant_frontent_output)

        return frontend_outputs


if TYPE_CHECKING:
    _: type[LLM] = AzureOpenAILLM
