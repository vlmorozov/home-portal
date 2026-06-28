import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  SubtaskRepository,
  SUBTASK_REPOSITORY,
} from '../../../domain/repositories/subtask.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository';

@Injectable()
export class ListSubtasksUseCase {
  private readonly logger = new Logger(ListSubtasksUseCase.name);

  constructor(
    @Inject(SUBTASK_REPOSITORY) private readonly subtasks: SubtaskRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, userId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    this.logger.log(`Listing subtasks for task ${taskId} and user ${userId}`);
    return this.subtasks.findAllForTask(taskId, userId);
  }
}
