import {
  CreateLogEntryRequest,
  LogEntryResponse,
} from '@mapistry/take-home-challenge-shared';
import { LogEntriesQueryRepository } from '../../persistence/repositories/LogEntriesQueryRepository';
import { LogEntriesRepository } from '../../persistence/repositories/LogEntriesRepository';
import { LogEntriesApiMapper } from '../mappers/LogEntriesApiMapper';

export class LogEntriesService {
  getLogEntries(logId: string): Promise<LogEntryResponse[]> {
    const logEntryRepository = new LogEntriesQueryRepository();
    return logEntryRepository.findLogEntries(logId);
  }

  async createLogEntry(
    logId: string,
    createLogEntry: CreateLogEntryRequest,
  ): Promise<LogEntryResponse> {
    const mapper = new LogEntriesApiMapper();
    const logEntry = mapper.fromRequest(logId, createLogEntry);
    const repository = new LogEntriesRepository(logId);
    const newEntry = await repository.createLogEntry(logEntry);
    return mapper.toResponse(newEntry);
  }

  async deleteLogEntry(logId: string, logEntryId: string): Promise<string> {
    const logEntryRepository = new LogEntriesRepository(logId);
    const logEntry = await logEntryRepository.findById(logEntryId);
    return logEntryRepository.destroyLogEntry(logEntry);
  }

  async editLogEntry(
    logId: string,
    logEntryId: string,
    createLogEntry: CreateLogEntryRequest,
  ): Promise<LogEntryResponse> {
    // Create a LogEntry from request  
    const logEntryRepository = new LogEntriesRepository(logId);
    const logEntry = await logEntryRepository.findById(logEntryId);
    if (!logEntry) {
      throw new Error(`Log entry with ID ${logEntryId} not found`);
    }
    const mapper = new LogEntriesApiMapper();
    const updatedLogEntry = mapper.fromRequestWithId(logId, logEntryId, createLogEntry);
    return logEntryRepository.editLogEntry(updatedLogEntry);



    // logEntry: LogEntry
  }
}
