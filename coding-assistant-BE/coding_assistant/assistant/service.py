from typing import TYPE_CHECKING, Dict, List, Protocol

from coding_assistant.assistant.models import (
    InitAssistantResult,
    AssistantMessageItem,
    AssistantMessageValue,
    CreateAssistantParams,
    CreateAssistantResult,
    CreateThreadParams,
    CreateThreadResult,
    DeleteAssistantResult,
    DeleteThreadResult,
    ListMessageResult,
    ListThreadsResult,
    SendMessageParams,
    SendMessageResult,
    UpdateThreadParams,
    UpdateThreadResult,
)
from coding_assistant.assistant.repository import IAssistantRepository
from coding_assistant.assistant.models import ModelType
from coding_assistant.assistant.constants import DEFAULT_ASSISTANT_NAME, ASSISTANT_INSTRUCTIONS
from coding_assistant.assistant.schemas import (
    AssistantEntity,
    AssistantMessageEntity,
    AssistantThreadEntity,
)
from coding_assistant.llms import LLM
from openai import AzureOpenAI

class IAssistantService(Protocol):

    async def init_assistant(self) -> InitAssistantResult:
        pass
    
    async def list_threads(self, assistant_id: str) -> ListThreadsResult:
        pass

    async def list_messages(self, thread_id: str) -> ListMessageResult:
        pass
    
    
    async def create_thread(
        self, assistant_id: str, params: CreateThreadParams
    ) -> CreateThreadResult:
        pass

    async def post_thread_message(
        self,
        assistant_id: str,
        thread_id: str,
        params: SendMessageParams,
    ) -> SendMessageResult:
        pass


    async def delete_thread(
        self, assistant_id: str, thread_id: str
    ) -> DeleteThreadResult:
        pass


    async def update_thread(
        self, thread_id: str, params: UpdateThreadParams
    ) -> UpdateThreadResult:
        pass


class AssistantService:
    def __init__(self, ar: IAssistantRepository, llm: LLM) -> None:
        self.ar = ar
        self.llm = llm

    async def init_assistant(self) -> InitAssistantResult:
        assistants: List[
            AssistantThreadEntity
        ] = await self.ar.list_assistants()
        
        if (len(assistants) == 0):
            params = CreateAssistantParams(
                model=ModelType.gpt_35_turbo.value, 
                name=DEFAULT_ASSISTANT_NAME, 
                instructions=ASSISTANT_INSTRUCTIONS)
            newAssistant = await self.create_assistant(params)
            print(InitAssistantResult(assistant=newAssistant.assistant))
            return InitAssistantResult(assistant=newAssistant.assistant)
        
        # (TODO): add more validation
        firstAssistant = assistants[0]
        return InitAssistantResult(assistant=firstAssistant)
    

    async def list_threads(self, assistant_id: str) -> ListThreadsResult:
        threads: List[AssistantThreadEntity] = await self.ar.list_threads(
            assistant_id
        )
        return ListThreadsResult(threads=threads)

    async def list_messages(self, thread_id: str) -> ListMessageResult:
        entities: List[AssistantMessageEntity] = await self.ar.list_messages(
            thread_id
        )
        messages = [
            AssistantMessageItem(
                id=entity.id,
                role=entity.role,
                created_at=entity.created_at,
                value=AssistantMessageValue(
                    type=entity.type, content=entity.content
                ),
            )
            for entity in entities
        ]

        return ListMessageResult(messages=messages)

    async def create_assistant(
        self, params: CreateAssistantParams
    ) -> CreateAssistantResult:

        # create assistant on the LLM side
        llm_assistant: AssistantEntity = await self.llm.create_assistant(
            name=params.name,
            instructions=params.instructions,
            model=params.model,
        )

        # add assistant info to db
        assistant: AssistantEntity | None = await self.ar.create_assistant(
            llm_assistant
        )

        return CreateAssistantResult(assistant=assistant)

    async def create_thread(
        self, assistant_id: str, params: CreateThreadParams
    ) -> CreateThreadResult:
        # default chat/thread name
        default_name = "New chat"

        # get current assistant info
        assistant: AssistantEntity | None = await self.ar.get_assistant(
            assistant_id
        )

        # create thread on LLM side
        llm_thread: AssistantThreadEntity = await self.llm.create_thread(
            assistant_id=assistant.id, default_name=default_name
        )

        # send message and get the result from LLM
        user_message_and_responses: List[
            AssistantMessageItem
        ] = await self.llm.process_user_message(
            assistant=assistant,
            thread_id=llm_thread.id,
            message=params.message,
        )

        # extract LLM responses
        responses = user_message_and_responses[1:]

        # save thread in the DB
        thread_entity: AssistantThreadEntity | None = (
            await self.ar.create_thread(llm_thread)
        )

        # save messages to the DB
        await self.ar.add_messages(
            assistant_id=assistant.id,
            thread_id=thread_entity.id,
            messages=user_message_and_responses,
        )

        return (
            CreateThreadResult(
                thread=thread_entity,
                messages=responses,
            )
            if thread_entity is not None
            else None
        )

    async def post_thread_message(
        self,
        assistant_id: str,
        thread_id: str,
        params: SendMessageParams,
    ) -> SendMessageResult:
        # get current assistant info
        assistant: AssistantEntity | None = await self.ar.get_assistant(
            assistant_id
        )

        # send message and get the result from LLM
        user_message_and_responses: List[
            AssistantMessageItem
        ] = await self.llm.process_user_message(
            assistant=assistant,
            thread_id=thread_id,
            message=params.message,
        )

        # extract LLM responses
        responses = user_message_and_responses[1:]

        # save messages to the DB
        await self.ar.add_messages(
            assistant_id=assistant.id,
            thread_id=thread_id,
            messages=user_message_and_responses,
        )

        return SendMessageResult(thread_id=thread_id, messages=responses)

    async def delete_assistant(self, assistant_id: str) -> AssistantEntity:      
        # delete from LLM
        await self.llm.delete_assistant(assistant_id)

        # Delete from DB
        deleted_assistant: AssistantEntity | None = (
            await self.ar.delete_assistant(assistant_id)
        )

        return DeleteAssistantResult(assistant=deleted_assistant)

    async def delete_thread(
        self, assistant_id: str, thread_id: str
    ) -> AssistantThreadEntity:

        # delete from LLM
        await self.llm.delete_thread(thread_id)

        # Delete from DB
        deleted_thread: AssistantThreadEntity = await self.ar.delete_thread(
            thread_id
        )

        return DeleteThreadResult(thread=deleted_thread)

    async def update_thread(
        self, thread_id: str, params: UpdateThreadParams
    ) -> AssistantThreadEntity:
        # update name in DB
        thread_entity: AssistantThreadEntity = await self.ar.update_thread(
            thread_id, params.name
        )

        return UpdateThreadResult(thread=thread_entity)


if TYPE_CHECKING:
    _: type[IAssistantService] = AssistantService
