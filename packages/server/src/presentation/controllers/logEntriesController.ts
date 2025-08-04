import { HttpStatusCode } from '@mapistry/take-home-challenge-shared';
import { Router } from 'express';
import { LogEntriesService } from '../../application/services/LogEntriesService';
import { RecordNotFoundError, ValidationError } from '../../shared/errors';

export const logEntriesController = Router();

logEntriesController.get('/logs/:logId/log-entries', async (req, res) => {
  const { logId } = req.params;
  const logEntryService = new LogEntriesService();
  const logEntries = await logEntryService.getLogEntries(logId);
  res.json(logEntries);
});

logEntriesController.put('/logs/:logId/log-entries', async (req, res) => {
  const { logId } = req.params;
  const { logEntry } = req.body;
  const logEntryService = new LogEntriesService();
  try {
    const logEntries = await logEntryService.createLogEntry(logId, logEntry);
    res.json(logEntries);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof ValidationError) {
      res.status(HttpStatusCode.INVALID_DATA);
      res.send(e.toString());
    } else {
      res.status(HttpStatusCode.SERVER_ERROR);
      res.send();
    }
  }
});

logEntriesController.delete(
  '/logs/:logId/log-entries/:logEntryId',
  async (req, res) => {
    const { logId, logEntryId } = req.params;
    const logEntryService = new LogEntriesService();
    try {
      const logEntries = await logEntryService.deleteLogEntry(
        logId,
        logEntryId,
      );
      res.json(logEntries);
    } catch (e: unknown) {
      if (e instanceof RecordNotFoundError) {
        res.status(HttpStatusCode.INVALID_DATA);
        res.send(e.toString());
      } else {
        res.status(HttpStatusCode.SERVER_ERROR);
        res.send();
      }
      res.json();
    }
  },
);

logEntriesController.patch(
  '/logs/:logId/log-entries/:logEntryId',
  async (req, res) => {
    const { logId, logEntryId } = req.params;
    const { logEntry } = req.body;
    console.log("Print log entry body", logEntry);
    console.log("lof id and logentryId", { logId, logEntryId });
    const logEntryService = new LogEntriesService();
    try {
      const updatedLogEntry = await logEntryService.editLogEntry(
        logId,
        logEntryId,
        logEntry,
      );
      res.json(updatedLogEntry);
    } catch (e: unknown) {
      console.log("Error in edit log entry", e);
      if (e instanceof RecordNotFoundError) {
        res.status(HttpStatusCode.INVALID_DATA);
        res.send(e.toString());
      } else {
        res.status(HttpStatusCode.SERVER_ERROR);
        res.send();
      }
    }
  },
);

