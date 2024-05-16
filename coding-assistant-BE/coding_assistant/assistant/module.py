from typing import Dict
from openai import AzureOpenAI
from coding_assistant.assistant.repository import (
    AssistantRepository,
    IAssistantRepository,
)
from coding_assistant.assistant.service import AssistantService, IAssistantService
from coding_assistant.llms.llm import LLM
from injector import Module, provider
from sqlalchemy.orm import Session


class AssistantModule(Module):
    @provider
    def provide_assistant_service(
        self, ar: IAssistantRepository, llm: LLM
    ) -> IAssistantService:
        return AssistantService(ar=ar, llm=llm)

    @provider
    def provide_assistant_repository(
        self, session: Session
    ) -> IAssistantRepository:
        return AssistantRepository(session=session)
