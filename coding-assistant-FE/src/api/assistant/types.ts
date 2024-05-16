export const enum AssistantRole {
  Assistant = 'assistant',
  User = 'user',
}

export enum AssistantMessageType {
  Text = 'text',
}

export interface Assistant {
  id: string;
  name: string;
  created_at: string;
  instructions: string;
  model: string;
}

export interface AssistantThread {
  id: string;
  name: string;
  assistant_id: string;
  created_at: string;
}

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  created_at: string;
  value: AssistantTextMessage;
}

export interface AssistantTextMessage {
  type: AssistantMessageType.Text;
  content: {
    message: string;
  };
}

export interface AssistantGetResponse {
  assistant: Assistant;
}

export interface ThreadsGetRequest {
  assistant_id: string;
}

export interface ThreadsGetResponse {
  threads: AssistantThread[];
}

export interface MessagesGetRequest {
  assistant_id: string;
  thread_id: string;
}

export interface MessagesGetResponse {
  messages: AssistantMessage[];
}

export interface ThreadInitializeRequest {
  assistant_id: string;
  message: string;
}

export interface ThreadInitializeResponse {
  thread: AssistantThread;
  messages: AssistantMessage[];
}

export interface AssistantMessageSendRequest extends ThreadInitializeRequest {
  thread_id: string;
}

export interface AssistantMessageSendResponse {
  assistant_id: string;
  thread_id: string;
  messages: AssistantMessage[];
}

export interface ThreadDeleteRequest {
  assistant_id: string;
  thread_id: string;
}

export interface ThreadDeleteResponse {
  thread: AssistantThread;
}

export interface ThreadUpdateRequest {
  assistant_id: string;
  thread_id: string;
  name: string;
}

export interface ThreadUpdateResponse {
  thread: AssistantThread;
}

export interface selectThreadIdPayload {
  thread_id: string | null;
}

export interface addUserMessagePayload {
  message: string;
}
