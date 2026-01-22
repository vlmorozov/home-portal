import { Task, TaskId } from '../task.entity';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findById(id: TaskId, userId: string): Promise<Task | null>;
  findAllForUser(userId: string): Promise<Task[]>;
  update(id: TaskId, userId: string, updates: Partial<Task>): Promise<Task | null>;
  delete(id: TaskId, userId: string): Promise<boolean>;
}
