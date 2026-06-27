import { TaskListId } from './task-list.entity';
import { TaskId } from './task.entity';

export type TaskListTaskId = string;

export class TaskListTask {
  constructor(
    public readonly id: TaskListTaskId,
    public readonly taskListId: TaskListId,
    public readonly taskId: TaskId,
    public readonly userId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
