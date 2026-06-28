import { Subtask, SubtaskId } from '../subtask.entity';
import { TaskId } from '../task.entity';

export const SUBTASK_REPOSITORY = Symbol('SUBTASK_REPOSITORY');

export interface CreateSubtaskInput {
  taskId: TaskId;
  parentTaskId: TaskId;
  userId: string;
}

export interface UpdateSubtaskInput {
  taskId?: TaskId;
}

export interface SubtaskRepository {
  create(subtask: CreateSubtaskInput): Promise<Subtask>;
  findById(
    id: SubtaskId,
    userId: string,
    parentTaskId: TaskId,
  ): Promise<Subtask | null>;
  findAllForTask(parentTaskId: TaskId, userId: string): Promise<Subtask[]>;
  update(
    id: SubtaskId,
    userId: string,
    parentTaskId: TaskId,
    updates: UpdateSubtaskInput,
  ): Promise<Subtask | null>;
  delete(id: SubtaskId, userId: string, parentTaskId: TaskId): Promise<boolean>;
}
