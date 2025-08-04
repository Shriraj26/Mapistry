import {
  CreateLogEntryRequest,
  LogEntryResponse,
} from '@mapistry/take-home-challenge-shared';

export interface CreateLogEntryParams {
  logId: string;
  logEntry: CreateLogEntryRequest;
}

export type FetchLogEntriesResponse = LogEntryResponse[];
export type CreateLogEntryResponse = LogEntryResponse;

export async function fetchLogEntries(
  logId: string,
): Promise<FetchLogEntriesResponse> {
  const res = await fetch(`/api/logs/${logId}/log-entries`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch log entries');
  }
  const logEntries: FetchLogEntriesResponse = await res.json();
  return logEntries;
}

export async function createLogEntry({
  logId,
  logEntry,
}: CreateLogEntryParams): Promise<CreateLogEntryResponse> {
  const res = await fetch(`/api/logs/${logId}/log-entries`, {
    body: JSON.stringify({ logEntry }),
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to create log entry');
  }
  const newlogEntry: CreateLogEntryResponse = await res.json();
  return newlogEntry;
}

export async function deleteLogEntry(logEntry: LogEntryResponse) {
  const { logId, id } = logEntry;
  const res = await fetch(`/api/logs/${logId}/log-entries/${id}`, {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete log entry');
  }
}

export async function editLogEntry(logEntryResponse: LogEntryResponse): Promise<CreateLogEntryResponse>{
  
  const { logId, id, logDate, logValue } = logEntryResponse;
  const res = await fetch(
    `/api/logs/${logId}/log-entries/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logEntry: {
          logDate,
          logValue
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error('Failed to edit log entry');
  }
  const updatedLogEntry: CreateLogEntryResponse = await res.json();
  return updatedLogEntry;
  // Note: The function currently returns the updated log entry.
  // If you need to handle the response differently, you can modify this.
  // For example, you might want to return a success message or nothing at all.
  // For now, I'm returning the updated log entry as it might be useful for the UI
  // to reflect the changes immediately.
  // If you want to change this behavior, you can adjust the return statement accordingly.
  // For example, you could return a success message like:
  // return { message: 'Log entry updated successfully' };
}



