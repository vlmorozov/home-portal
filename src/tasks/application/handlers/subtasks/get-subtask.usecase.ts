import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  SubtaskRepository,
  SUBTASK_REPOSITORY,
} from '../../../domain/repositories/subtask.repository';

@Injectable()
export class GetSubtaskUseCase {
  private readonly logger = new Logger(GetSubtaskUseCase.name);

  constructor(
    @Inject(SUBTASK_REPOSITORY) private readonly subtasks: SubtaskRepository,
  ) {}

  async execute(taskId: string, subtaskId: string, userId: string) {
    const subtask = await this.subtasks.findById(subtaskId, userId, taskId);
    if (!subtask) throw new NotFoundException('SUBTASK_NOT_FOUND');

    this.logger.log(`Subtask fetched ${subtaskId} for user ${userId}`);
    return subtask;
  }
}
