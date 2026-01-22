export type TaskId = string;
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export class Task {
  constructor(
    public readonly id: TaskId,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public dueDate: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
