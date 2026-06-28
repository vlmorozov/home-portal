import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository';

@Injectable()
export class GetTaskUseCase {
  private readonly logger = new Logger(GetTaskUseCase.name);
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, userId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');
    this.logger.log(`Task fetched ${taskId} for user ${userId}`);
    return task;
  }
}
