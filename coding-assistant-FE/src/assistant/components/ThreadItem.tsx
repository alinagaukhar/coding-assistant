import { Button, Colors, Icon, InputGroup, Intent } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../api';
import { assistantActions, selectAssistant, selectSelectedThreadId } from '../../api/assistant/module';
import { AssistantThread } from '../../api/assistant/types';
import DeleteConfirmationPopup from '../../shared/components/DeleteConfirmationPopup';
import { useOnClickOutside } from '../../shared/hooks/useOnClickOutside';

interface Props {
  assistantThread: AssistantThread;
}

// ThreadItem is a component that renders a thread item. It allows the user to edit the thread name and delete the thread.
const ThreadItem = ({ assistantThread }: Props) => {
  const selectedThreadId: string | null = useSelector(selectSelectedThreadId);
  const assistant = useSelector(selectAssistant)!;
  const assistantId = assistant.id;

  const [name, setName] = useState<string>(assistantThread.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleEditClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setIsEditingName(true);
  };

  const handleSaveClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setIsEditingName(false);
    dispatch(
      assistantActions.updateThread({
        assistant_id: assistantThread.assistant_id,
        thread_id: assistantThread.id,
        name: name,
      })
    );
  };

  const handleLocalDeleteClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(false);
    dispatch(assistantActions.deleteThread({ assistant_id: assistantId!, thread_id: assistantThread.id }));
  };

  const onThreadClick = () => {
    dispatch(assistantActions.resetMessagesState());
    dispatch(
      assistantActions.getMessages({
        thread_id: assistantThread!.id,
        assistant_id: assistantId!,
      })
    );
    dispatch(assistantActions.selectThreadId({ thread_id: assistantThread.id }));
  };

  useOnClickOutside(inputRef, () => setIsEditingName(false));

  return (
    <ThreadItemContainer selected={selectedThreadId === assistantThread.id} ref={inputRef}>
      {!isEditingName && (
        <ThreadNameContainer onClick={() => onThreadClick()}>{assistantThread.name}</ThreadNameContainer>
      )}
      {isEditingName && (
        <InputGroup
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Thread Name"
          style={{ fontSize: '16px' }}
        />
      )}
      <StyledMoreDropdown className="more-dropdown">
        {!isEditingName && (
          <Button
            onClick={handleEditClick}
            intent={Intent.NONE}
            style={{ marginLeft: '0px', cursor: 'pointer', borderRadius: '4px' }}
            minimal
            small
          >
            <Icon icon={'edit'} />
          </Button>
        )}

        {isEditingName && (
          <Button
            onClick={handleSaveClick}
            intent={Intent.SUCCESS}
            style={{ marginLeft: '0px', cursor: 'pointer', borderRadius: '4px' }}
            minimal
            small
            disabled={name === ''}
          >
            <Icon icon={'tick'} />
          </Button>
        )}
        <Button
          onClick={handleLocalDeleteClick}
          icon="trash"
          intent={Intent.DANGER}
          style={{ marginRight: '10px', cursor: 'pointer', borderRadius: '4px' }}
          minimal
          small
        />
      </StyledMoreDropdown>
      <DeleteConfirmationPopup
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => handleDeleteClick()}
        message={`Are you sure you want to delete chat "${assistantThread.name}"`}
      />
    </ThreadItemContainer>
  );
};

export default ThreadItem;

const ThreadItemContainer = styled.div<{ selected: boolean }>`
  display: flex;
  width: 100%;
  height: 40px;
  background-color: ${({ selected }) => (selected ? Colors.DARK_GRAY3 : '')};
  padding: 10px;
  color: ${Colors.LIGHT_GRAY5};

  cursor: pointer;
  :hover {
    background-color: ${Colors.DARK_GRAY2};
  }
  justify-content: space-between;
  align-items: center;

  .more-dropdown {
    display: none;
  }

  :hover {
    .more-dropdown {
      display: initial;
    }
  }
`;

const StyledMoreDropdown = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
`;

const ThreadNameContainer = styled.div`
  font-size: 16px;
  font-weight: 450;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
