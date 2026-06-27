import { TaskListTask, TaskListTaskId } from '../task-list-task.entity';
import { TaskListId } from '../task-list.entity';
import { Task, TaskId } from '../task.entity';

export const TASK_LIST_TASK_REPOSITORY = Symbol('TASK_LIST_TASK_REPOSITORY');

export interface CreateTaskListTaskInput {
  taskListId: TaskListId;
  taskId: TaskId;
  userId: string;
}

export interface TaskListTaskRepository {
  create(input: CreateTaskListTaskInput): Promise<TaskListTask>;
  findById(id: TaskListTaskId, userId: string): Promise<TaskListTask | null>;
  findByTask(
    taskListId: TaskListId,
    taskId: TaskId,
    userId: string,
  ): Promise<TaskListTask | null>;
  findTasksForList(taskListId: TaskListId, userId: string): Promise<Task[]>;
  deleteByTask(
    taskListId: TaskListId,
    taskId: TaskId,
    userId: string,
  ): Promise<boolean>;
}
