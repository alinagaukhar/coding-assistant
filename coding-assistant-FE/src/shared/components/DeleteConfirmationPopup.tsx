import { Button, Classes, Dialog } from '@blueprintjs/core';
import React from 'react';

interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message = 'Are you sure you want to delete this?',
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      className="bp5-dark"
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
    >
      <div className={Classes.DIALOG_BODY}>
        <p>{message}</p>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent="danger" onClick={onConfirm}>
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;
