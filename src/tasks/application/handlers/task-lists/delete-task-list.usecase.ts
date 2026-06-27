import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '../../../domain/repositories/task-list.repository';

@Injectable()
export class DeleteTaskListUseCase {
  private readonly logger = new Logger(DeleteTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(taskListId: string, userId: string) {
    const removed = await this.taskLists.delete(taskListId, userId);
    if (!removed) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    this.logger.log(`Task list deleted ${taskListId} by user ${userId}`);
  }
}
