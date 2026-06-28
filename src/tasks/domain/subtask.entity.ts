import { TaskId } from './task.entity';

export type SubtaskId = string;

export class Subtask {
  constructor(
    public readonly id: SubtaskId,
    public readonly userId: string,
    public readonly parentTaskId: TaskId,
    public readonly taskId: TaskId,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
