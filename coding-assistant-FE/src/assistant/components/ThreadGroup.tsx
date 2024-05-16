import { Colors } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { AssistantThread } from '../../api/assistant/types';
import ThreadItem from './ThreadItem';

interface Props {
  category: string;
  threads: AssistantThread[];
}

// ThreadGroup is a component that renders a thread date category and its threads.
const ThreadGroup = ({ category, threads }: Props) => {
  return (
    <>
      <StyledCategoryName>{category}</StyledCategoryName>
      <div style={{ padding: '5px' }}>
        {threads.map((thread) => (
          <ThreadItem key={thread.id} assistantThread={thread} />
        ))}
      </div>
    </>
  );
};

const StyledCategoryName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${Colors.GRAY5};
`;
export default ThreadGroup;
