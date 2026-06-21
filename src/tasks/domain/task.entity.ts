export type TaskId = string;

export class Task {
  constructor(
    public readonly id: TaskId,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
