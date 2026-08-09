import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskEventRepository,
  TASK_EVENT_REPOSITORY,
} from '@tasks/domain/repositories/task-event.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '@tasks/domain/repositories/task.repository';

@Injectable()
export class DeleteTaskEventUseCase {
  private readonly logger = new Logger(DeleteTaskEventUseCase.name);

  constructor(
    @Inject(TASK_EVENT_REPOSITORY)
    private readonly taskEvents: TaskEventRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, taskEventId: string, userId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    const removed = await this.taskEvents.delete(taskEventId, userId, taskId);
    if (!removed) throw new NotFoundException('TASK_EVENT_NOT_FOUND');

    this.logger.log(
      `Task event deleted ${taskEventId} for task ${taskId} by user ${userId}`,
    );
  }
}
