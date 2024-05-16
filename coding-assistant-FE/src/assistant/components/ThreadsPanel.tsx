import { Button, Colors, Icon, IconSize, Intent, Spinner, SpinnerSize, Tooltip } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { nanoid } from '@reduxjs/toolkit';
import _ from 'lodash';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../api';
import {
  assistantActions,
  selectIsThreadsLoading,
  selectIsThreadsSuccess,
  selectThreads,
} from '../../api/assistant/module';
import { AssistantThread } from '../../api/assistant/types';
import { categorizeDate } from '../helpers/datetimehelper';
import ThreadGroup from './ThreadGroup';

const ThreadsPanel: React.FC = () => {
  const assistantThreads: AssistantThread[] = useSelector(selectThreads);
  const isGetThreadsLoading = useSelector(selectIsThreadsLoading);
  const isGetThreadsSuccess = useSelector(selectIsThreadsSuccess);
  const dispatch = useDispatch<AppDispatch>();

  const [isExpanded, setIsExpanded] = useState(true);

  const onNewChatClick = () => {
    dispatch(assistantActions.selectThreadId({ thread_id: null }));
    dispatch(assistantActions.resetMessagesState());
  };

  const threadsWithDateCategory = assistantThreads.map((thread) => ({
    ...thread,
    ...categorizeDate(new Date(thread.created_at)),
  }));

  const groupedAssistantThreads = _.chain(threadsWithDateCategory)
    .groupBy('dateType')
    .map((value, key) => ({
      category: key,
      categoryStartDate: value[0].startOfDate,
      threads: value.map((v) => v as AssistantThread).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }))
    .orderBy(['categoryStartDate'], ['desc'])
    .value();

  return (
    <StyledHost isExpanded={isExpanded} width="300px">
      {isExpanded ? (
        <ThreadsPanelContainer>
          <Icon
            icon="double-chevron-left"
            color={Colors.LIGHT_GRAY1}
            size={IconSize.LARGE}
            style={{ position: 'absolute', right: 15, top: 15, cursor: 'pointer' }}
            onClick={() => setIsExpanded(false)}
          />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              icon={<Icon icon="add" size={20} />}
              minimal
              text="Start New Chat"
              style={{ marginBottom: '10px', marginTop: '30px', fontSize: '18px' }}
              onClick={() => onNewChatClick()}
              intent={Intent.PRIMARY}
              large
            />
          </div>
          <ThreadsContainer>
            {isGetThreadsLoading && <Spinner size={SpinnerSize.SMALL} />}
            {isGetThreadsSuccess &&
              groupedAssistantThreads.map(({ category, threads }) => (
                <ThreadGroup key={nanoid()} category={category} threads={threads} />
              ))}
          </ThreadsContainer>
        </ThreadsPanelContainer>
      ) : (
        <StyledVerticalTitle onClick={() => setIsExpanded(true)}>
          <Tooltip content="Open Threads Panel" minimal>
            <Icon
              icon="double-chevron-right"
              color={Colors.LIGHT_GRAY1}
              size={IconSize.LARGE}
              style={{ marginTop: '10px' }}
            />
          </Tooltip>
        </StyledVerticalTitle>
      )}
    </StyledHost>
  );
};

export default ThreadsPanel;

const StyledHost = styled.div<{ isExpanded: boolean; width: string }>`
  width: ${({ isExpanded, width }) => (isExpanded ? width : '50px')};
  min-width: ${({ isExpanded, width }) => (isExpanded ? width : '50px')};
  position: relative;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.6);
  background-color: ${Colors.DARK_GRAY4};
  flex-shrink: 0;
  height: calc(100vh - 80px);
`;

const ThreadsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const ThreadsContainer = styled.div`
  overflow-y: auto;
`;

const StyledVerticalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;

  .bp5-icon {
    align-self: center;
    justify-content: center;
  }
`;
