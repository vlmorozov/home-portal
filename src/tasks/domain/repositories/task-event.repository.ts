import { TaskEvent, TaskEventId, TaskStatus } from '../task-event.entity';
import { TaskId } from '../task.entity';

export const TASK_EVENT_REPOSITORY = Symbol('TASK_EVENT_REPOSITORY');

export interface CreateTaskEventInput {
  taskId: TaskId;
  userId: string;
  status: TaskStatus;
  dueDate: Date | null;
}

export interface TaskEventRepository {
  create(event: CreateTaskEventInput): Promise<TaskEvent>;
  findById(id: TaskEventId, userId: string): Promise<TaskEvent | null>;
  findAllForTask(taskId: TaskId, userId: string): Promise<TaskEvent[]>;
  findLatest(taskId: TaskId, userId: string): Promise<TaskEvent | null>;
}
