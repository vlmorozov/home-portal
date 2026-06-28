import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '../../../domain/repositories/task-list.repository';
import {
  TaskListTaskRepository,
  TASK_LIST_TASK_REPOSITORY,
} from '../../../domain/repositories/task-list-task.repository';

@Injectable()
export class RemoveTaskFromTaskListUseCase {
  private readonly logger = new Logger(RemoveTaskFromTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_TASK_REPOSITORY)
    private readonly taskListTasks: TaskListTaskRepository,
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(taskListId: string, taskId: string, userId: string) {
    const taskList = await this.taskLists.findById(taskListId, userId);
    if (!taskList) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    const removed = await this.taskListTasks.deleteByTask(
      taskListId,
      taskId,
      userId,
    );
    if (!removed) throw new NotFoundException('TASK_LIST_TASK_NOT_FOUND');

    this.logger.log(
      `Task ${taskId} removed from task list ${taskListId} by user ${userId}`,
    );
  }
}
