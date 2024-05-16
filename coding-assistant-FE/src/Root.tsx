import { Colors, Dialog, Spinner, SpinnerSize } from '@blueprintjs/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './api';
import {
  assistantActions,
  selectAssistant,
  selectAssistantGetError,
  selectIAssistantLoading,
  selectIAssistantSuccess,
} from './api/assistant/module';
import logo from './assets/logo.svg';
import MainPage from './assistant/components/MainPage';
import { AppToaster } from './shared/components/AppToaster';

const Root = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isGetAssistantLoading = useSelector(selectIAssistantLoading);
  const isGetAssistantSuccess = useSelector(selectIAssistantSuccess);
  const assistantGetError = useSelector(selectAssistantGetError);
  const assistant = useSelector(selectAssistant);

  useEffect(() => {
    dispatch(assistantActions.getAssistant());
  }, []);

  useEffect(() => {
    if (!_.isNull(assistantGetError)) {
      AppToaster.show({ message: 'Something went wrong. Please try again later.', intent: 'danger', timeout: 8000 });
    }
  }, [assistantGetError]);

  return (
    <StyledMain className="bp5-dark">
      <Dialog isOpen={isGetAssistantLoading} canEscapeKeyClose={false} title="Please, wait..." className="bp5-dark">
        <StyledDialogBody>
          <Spinner size={SpinnerSize.STANDARD} />
          <p style={{ fontSize: '16px' }}>Initializing assitant...</p>
        </StyledDialogBody>
      </Dialog>
      <StyledTopBar>
        <img src={logo} alt="" style={{ height: '40px', width: '40px' }} />
        <div>Your coding assistant</div>
      </StyledTopBar>
      {isGetAssistantSuccess && !_.isNil(assistant) && <MainPage />}
    </StyledMain>
  );
};

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledDialogBody = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 30px;
`;

const StyledTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 80px;
  flex-shrink: 0;
  padding: 0 20px;
  font-weight: 300;
  font-size: 26px;
  position: relative;
  background-color: ${Colors.BLACK};
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.6);
  z-index: 2;
`;

export default Root;
