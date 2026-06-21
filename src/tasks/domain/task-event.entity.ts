import { TaskId } from './task.entity';

export type TaskEventId = string;
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export class TaskEvent {
  constructor(
    public readonly id: TaskEventId,
    public readonly taskId: TaskId,
    public readonly userId: string,
    public status: TaskStatus,
    public dueDate: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
