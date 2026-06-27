import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '../../../domain/repositories/task-list.repository';
import {
  TaskListTaskRepository,
  TASK_LIST_TASK_REPOSITORY,
} from '../../../domain/repositories/task-list-task.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository';

@Injectable()
export class AddTaskToTaskListUseCase {
  private readonly logger = new Logger(AddTaskToTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_TASK_REPOSITORY)
    private readonly taskListTasks: TaskListTaskRepository,
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(input: { taskListId: string; taskId: string; userId: string }) {
    const taskList = await this.taskLists.findById(
      input.taskListId,
      input.userId,
    );
    if (!taskList) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    const task = await this.tasks.findById(input.taskId, input.userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    const existing = await this.taskListTasks.findByTask(
      input.taskListId,
      input.taskId,
      input.userId,
    );
    if (existing) return existing;

    const link = await this.taskListTasks.create(input);
    this.logger.log(
      `Task ${input.taskId} added to task list ${input.taskListId} by user ${input.userId}`,
    );
    return link;
  }
}
