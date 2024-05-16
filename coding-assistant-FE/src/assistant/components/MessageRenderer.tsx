import { Text } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { AssistantMessage, AssistantMessageType, AssistantRole } from '../../api/assistant/types';
import MarkdownComponent from './Markdown';

const MessageRenderer = ({ message }: { message: AssistantMessage }) => {
  const { role, value } = message;
  const { type, content } = value;

  switch (type) {
    case AssistantMessageType.Text:
      return (
        <StyledMessage>
          <StyledRole>{role === AssistantRole.User ? 'You' : AssistantRole.Assistant}</StyledRole>
          <MarkdownComponent markdown={content.message} />
        </StyledMessage>
      );
    default:
      return null;
  }
};

const StyledMessage = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  color: white;
  font-size: 18px;

  border-radius: 5px;
  width: fit-content;
  word-break: break-word;
`;

const StyledRole = styled(Text)`
  font-weight: bold;
  text-transform: capitalize;
  font-size: 20px;
  margin-bottom: 5px;
`;

export default MessageRenderer;
