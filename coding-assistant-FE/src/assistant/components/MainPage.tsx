import { Colors } from '@blueprintjs/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../api';
import { assistantActions, selectAssistant } from '../../api/assistant/module';
import { Assistant } from '../../api/assistant/types';
import InputPanel from './InputPanel';
import MessageDisplay from './MessageDisplayPanel';
import ThreadsPanel from './ThreadsPanel';

const MainPage = () => {
  const assistant: Assistant | null = useSelector(selectAssistant);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!_.isNil(assistant)) {
      console.log(assistant);
      dispatch(assistantActions.getThreads({ assistant_id: assistant.id }));
    }
  }, [assistant]);

  return (
    <StyledMain className="bp5-dark">
      <ThreadsPanel />
      <ChatContainer>
        <MessageDisplay />
        <InputPanel />
      </ChatContainer>
    </StyledMain>
  );
};

const StyledMain = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
`;

const ChatContainer = styled.div`
  padding: 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${Colors.DARK_GRAY1};
  overflow: auto;
  height: calc(100vh - 80px);
`;

export default MainPage;
