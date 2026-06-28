import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
  private readonly logger = new Logger(DeleteTaskUseCase.name);
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, userId: string) {
    const removed = await this.tasks.delete(taskId, userId);
    if (!removed) throw new NotFoundException('TASK_NOT_FOUND');
    this.logger.log(`Task deleted ${taskId} by user ${userId}`);
  }
}
