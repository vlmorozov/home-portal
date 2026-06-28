import { Task, TaskId } from '../task.entity';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
}

export interface TaskRepository {
  create(task: CreateTaskInput): Promise<Task>;
  findById(id: TaskId, userId: string): Promise<Task | null>;
  findAllForUser(userId: string): Promise<Task[]>;
  update(
    id: TaskId,
    userId: string,
    updates: UpdateTaskInput,
  ): Promise<Task | null>;
  delete(id: TaskId, userId: string): Promise<boolean>;
}
