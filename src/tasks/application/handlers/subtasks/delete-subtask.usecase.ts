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
export class DeleteSubtaskUseCase {
  private readonly logger = new Logger(DeleteSubtaskUseCase.name);

  constructor(
    @Inject(SUBTASK_REPOSITORY) private readonly subtasks: SubtaskRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, subtaskId: string, userId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    const removed = await this.subtasks.delete(subtaskId, userId, taskId);
    if (!removed) throw new NotFoundException('SUBTASK_NOT_FOUND');

    this.logger.log(
      `Subtask deleted ${subtaskId} for task ${taskId} by user ${userId}`,
    );
  }
}
