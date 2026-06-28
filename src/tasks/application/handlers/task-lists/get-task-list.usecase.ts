import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '../../../domain/repositories/task-list.repository';

@Injectable()
export class GetTaskListUseCase {
  private readonly logger = new Logger(GetTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(taskListId: string, userId: string) {
    const taskList = await this.taskLists.findById(taskListId, userId);
    if (!taskList) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    this.logger.log(`Task list fetched ${taskListId} for user ${userId}`);
    return taskList;
  }
}
