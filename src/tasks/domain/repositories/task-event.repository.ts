import { TaskEvent, TaskEventId, TaskStatus } from '../task-event.entity';
import { TaskId } from '../task.entity';

export const TASK_EVENT_REPOSITORY = Symbol('TASK_EVENT_REPOSITORY');

export interface CreateTaskEventInput {
  taskId: TaskId;
  userId: string;
  status: TaskStatus;
  dueDate: Date | null;
}

export interface UpdateTaskEventInput {
  status?: TaskStatus;
  dueDate?: Date | null;
}

export interface TaskEventRepository {
  create(event: CreateTaskEventInput): Promise<TaskEvent>;
  findById(id: TaskEventId, userId: string): Promise<TaskEvent | null>;
  findAllForTask(taskId: TaskId, userId: string): Promise<TaskEvent[]>;
  findLatest(taskId: TaskId, userId: string): Promise<TaskEvent | null>;
  update(
    id: TaskEventId,
    userId: string,
    taskId: TaskId,
    updates: UpdateTaskEventInput,
  ): Promise<TaskEvent | null>;
  delete(id: TaskEventId, userId: string, taskId: TaskId): Promise<boolean>;
}
