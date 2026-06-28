import { TaskList, TaskListId } from '../task-list.entity';

export const TASK_LIST_REPOSITORY = Symbol('TASK_LIST_REPOSITORY');

export interface CreateTaskListInput {
  userId: string;
  title: string;
  description?: string | null;
}

export interface UpdateTaskListInput {
  title?: string;
  description?: string | null;
}

export interface TaskListRepository {
  create(taskList: CreateTaskListInput): Promise<TaskList>;
  findById(id: TaskListId, userId: string): Promise<TaskList | null>;
  findAllForUser(userId: string): Promise<TaskList[]>;
  update(
    id: TaskListId,
    userId: string,
    updates: UpdateTaskListInput,
  ): Promise<TaskList | null>;
  delete(id: TaskListId, userId: string): Promise<boolean>;
}
