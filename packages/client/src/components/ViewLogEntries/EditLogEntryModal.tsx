import { CreateLogEntryRequest, LogEntryResponse } from '@mapistry/take-home-challenge-shared';
import { log } from 'console';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface CreateLogEntryProps {
  handleClose: () => void;
  handleEdit: (logEntry: LogEntryResponse) => void;
  logEntry: LogEntryResponse; // Optional, as it may not always be passed
}

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(212, 172, 172);
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 20%;
`;

interface CloseButtonProps {
  type: string;
  onClick: () => void;
  children: ReactNode;
}

const CloseButton = styled.button<CloseButtonProps>`
  float: right;
`;

interface FormProps {
  onSubmit: (event: React.SyntheticEvent) => void;
  children: ReactNode;
}

const StyledForm = styled.form<FormProps>`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;

  label {
    margin: 0.3rem;
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 0.3rem 0;
  }
`;

const Header = styled.p`
  padding: 0.4rem;
  font-size: 1.2rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;

  button {
    margin-left: 0.3rem;
  }
`;

export function CreateLogEntryModal({
  handleClose,
  handleEdit,
  logEntry
}: CreateLogEntryProps) {
  return (
    <Modal>
      <ModalContent>
        <CloseButton type="button" onClick={handleClose}>
          X
        </CloseButton>
        <Header>Edit Log Entry</Header>
        <StyledForm
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              logDate: { value: string };
              logValue: { value: string };
            };
            const logEntryNew = {
              logDate: new Date(target.logDate.value),
              logValue: parseInt(target.logValue.value, 10),
              id: logEntry.id, // Ensure the ID is included for editing
              logId: logEntry.logId, // Include the logId if necessary
            };
            handleEdit(logEntryNew);
          }}
        >
          <label htmlFor="logDate">
            Date:&nbsp;
            <input type="date" name="logDate" defaultValue={logEntry.logDate as string}/>
          </label>
          
          <label htmlFor="logValue">
            Value:&nbsp;
            <input type="text" name="logValue" defaultValue={logEntry.logValue}/>
          </label>
          <ButtonContainer>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </ButtonContainer>
        </StyledForm>
      </ModalContent>
    </Modal>
  );
}
