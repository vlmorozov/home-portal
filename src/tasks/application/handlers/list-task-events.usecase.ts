import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskEventRepository,
  TASK_EVENT_REPOSITORY,
} from '../../domain/repositories/task-event.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../../domain/repositories/task.repository';

@Injectable()
export class ListTaskEventsUseCase {
  private readonly logger = new Logger(ListTaskEventsUseCase.name);

  constructor(
    @Inject(TASK_EVENT_REPOSITORY)
    private readonly taskEvents: TaskEventRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(taskId: string, userId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    this.logger.log(
      `Listing task events for task ${taskId} and user ${userId}`,
    );
    return this.taskEvents.findAllForTask(taskId, userId);
  }
}
