export type TaskListId = string;

export class TaskList {
  constructor(
    public readonly id: TaskListId,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
