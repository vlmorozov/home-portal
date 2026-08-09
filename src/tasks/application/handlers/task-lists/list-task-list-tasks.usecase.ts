import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '@tasks/domain/repositories/task-list.repository';
import {
  TaskListTaskRepository,
  TASK_LIST_TASK_REPOSITORY,
} from '@tasks/domain/repositories/task-list-task.repository';

@Injectable()
export class ListTaskListTasksUseCase {
  private readonly logger = new Logger(ListTaskListTasksUseCase.name);

  constructor(
    @Inject(TASK_LIST_TASK_REPOSITORY)
    private readonly taskListTasks: TaskListTaskRepository,
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(taskListId: string, userId: string) {
    const taskList = await this.taskLists.findById(taskListId, userId);
    if (!taskList) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    this.logger.log(
      `Listing tasks for task list ${taskListId} and user ${userId}`,
    );
    return this.taskListTasks.findTasksForList(taskListId, userId);
  }
}
