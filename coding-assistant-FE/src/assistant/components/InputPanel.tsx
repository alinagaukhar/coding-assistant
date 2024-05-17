import { Button, TextArea } from '@blueprintjs/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { atom, useRecoilState } from 'recoil';
import { AppDispatch } from '../../api';
import {
  assistantActions,
  selectAssistant,
  selectIsNOTReadyForMessage,
  selectSelectedThreadId,
} from '../../api/assistant/module';
import { AppToaster } from '../../shared/components/AppToaster';

export const promptState = atom<string>({
  key: 'prompt',
  default: '',
});

const InputPanel: React.FC = () => {
  const assistant = useSelector(selectAssistant);
  const assistantId = assistant?.id;

  const selectedThreadId: string | null = useSelector(selectSelectedThreadId);
  const isNOTReadyForMessage: boolean = useSelector(selectIsNOTReadyForMessage);

  const [prompt, setPrompt] = useRecoilState(promptState);

  const dispatch = useDispatch<AppDispatch>();

  const handleSendMessage = async () => {
    if (_.isNil(assistantId)) {
      AppToaster.show({ message: 'Something went wrong. Please try again later.', intent: 'danger', timeout: 8000 });
      return;
    }

    dispatch(assistantActions.addUserMessage({ message: prompt }));
    if (_.isNull(selectedThreadId)) {
      dispatch(assistantActions.initializeThread({ assistant_id: assistantId, message: prompt }));
    } else {
      dispatch(
        assistantActions.sendMessage({
          thread_id: selectedThreadId!,
          assistant_id: assistantId!,
          message: prompt,
        })
      );
    }
    setPrompt('');
  };

  return (
    <InputTextAreaContainer>
      <TextArea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (!isNOTReadyForMessage && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        fill
        autoResize
        autoFocus
      />
      <Button
        icon="send-message"
        minimal
        style={{ position: 'absolute', bottom: 3, right: 100 }}
        onClick={handleSendMessage}
        disabled={isNOTReadyForMessage}
      />
    </InputTextAreaContainer>
  );
};

export default InputPanel;

const InputTextAreaContainer = styled.div`
  margin-top: auto;
  width: 100%;
  position: relative;
  padding-inline: 100px;
`;
