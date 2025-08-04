import { LogEntryResponse, CreateLogEntryRequest } from '@mapistry/take-home-challenge-shared';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLogEntries } from '../../hooks/useLogEntries';
import { deleteLogEntry, editLogEntry } from '../../shared/apiClient/logsApi';
import { CreateLogEntryModal } from './EditLogEntryModal';

interface ViewLogEntriesTableProps {
  logId: string;
}

const StyledTable = styled.table`
  width: 100%;
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  th,
  td {
    padding: 1rem;
    text-align: center;
  }
  th {
    font-weight: 700;
    border-bottom: 1px solid;
  }
`;

export function ViewLogEntriesTable({ logId }: ViewLogEntriesTableProps) {
  const { logEntries, refreshLogEntries } = useLogEntries({ logId });
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState<LogEntryResponse>({
    logDate: new Date(),
    logValue: 0,
    id: '', // Initialize with empty ID
    logId: '', // Ensure logId is set for the new entry
  });
  
  const handleDelete = useCallback(
    async (logEntry) => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (confirm('Are you sure?')) {
        await deleteLogEntry(logEntry);
        refreshLogEntries();
      }
    },
    [refreshLogEntries],
  );

  const handleEdit = useCallback((logEntry) => {
    // Logic for editing a log entry can be implemented here
    
    const formattedLogEntry: LogEntryResponse = {
      logDate: new Date(logEntry.logDate).toISOString().split('T')[0], // Pre-format the date
      logValue: logEntry.logValue,
      id: logEntry.id, // Ensure the ID is included for editing
      logId: logEntry.logId, // Include the logId if necessary
    };
    setSelectedLogEntry(formattedLogEntry);
    setIsEditEntryOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditEntryOpen(false);
  }, [setIsEditEntryOpen]);

  const handleEditLogEntry = useCallback(
    async (logEntry) => {
      // Call the API to update the log entry
      await editLogEntry(logEntry);
      // Logic for handling the edited log entry
      setIsEditEntryOpen(false);
      refreshLogEntries();
    },
    [setIsEditEntryOpen, refreshLogEntries],
  );

  function columns() {
    return (
      <thead>
        <tr>
          <th>Log Date</th>
          <th>Log Value</th>
          <th>Actions</th>
        </tr>
      </thead>
    );
  }

  function actions(logEntry: LogEntryResponse) {
    return (
      <div>
        <button type="button" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(logEntry)}>
          Edit
        </button>
        <button type="button" onClick={() => handleDelete(logEntry)}>
          Delete
        </button>
      </div>
    );
  }

  function logEntryRow(logEntry: LogEntryResponse) {
    return (
      <tr key={logEntry.id}>
        <td>{new Date(logEntry.logDate).toLocaleDateString()}</td>
        <td>{logEntry.logValue}</td>
        <td>{actions(logEntry)}</td>
      </tr>
    );
  }

  function rows() {
    return <tbody>{logEntries.map((logEntry) => logEntryRow(logEntry))}</tbody>;
  }

  return (
    <div>
      {isEditEntryOpen && (
              <CreateLogEntryModal
                handleClose={handleCloseModal}
                handleEdit={handleEditLogEntry}
                logEntry={selectedLogEntry} // Pass the selected log entry
              />
      )}

      <StyledTable>
        {columns()}
        {rows()}
      </StyledTable>
    </div>
  );
}
