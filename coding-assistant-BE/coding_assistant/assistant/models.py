from datetime import datetime
from typing import Any, List
from enum import Enum

from pydantic.dataclasses import dataclass

from coding_assistant.assistant.schemas import (
    AssistantEntity,
    AssistantThreadEntity,
    Role,
    AssistantMessageType,
)

class ModelType(Enum):
    gpt_35_turbo = "gpt-35-turbo"

# For Messages
@dataclass
class AssistantMessageValue:
    type: AssistantMessageType
    content: dict[str, Any]


@dataclass
class AssistantMessageItem:
    id: str
    role: Role
    created_at: datetime
    value: AssistantMessageValue


# For GET requests
@dataclass
class InitAssistantResult:
    assistant: AssistantEntity

@dataclass
class ListThreadsResult:
    threads: List[AssistantThreadEntity]


@dataclass
class ListMessageResult:
    messages: List[AssistantMessageItem]


# For POST requests
@dataclass
class CreateAssistantParams:
    name: str 
    instructions: str
    model: str


@dataclass
class CreateAssistantResult:
    assistant: AssistantEntity


@dataclass
class CreateThreadParams:
    message: str


@dataclass
class CreateThreadResult:
    thread: AssistantThreadEntity
    messages: List[AssistantMessageItem]


@dataclass
class SendMessageParams:
    message: str


@dataclass
class SendMessageResult:
    thread_id: str
    messages: List[AssistantMessageItem]


# For DELETE requests
@dataclass
class DeleteAssistantResult:
    assistant: AssistantEntity


@dataclass
class DeleteThreadResult:
    thread: AssistantThreadEntity


# For PATCH requests
@dataclass
class UpdateThreadParams:
    name: str


@dataclass
class UpdateThreadResult:
    thread: AssistantThreadEntity
