import { TaskEventRepository } from './task-event.repository';
import { TaskRepository } from './task.repository';

export const TASK_UNIT_OF_WORK = Symbol('TASK_UNIT_OF_WORK');

export interface TaskUnitOfWorkContext {
  tasks: TaskRepository;
  taskEvents: TaskEventRepository;
}

export interface TaskUnitOfWork {
  transaction<T>(
    work: (context: TaskUnitOfWorkContext) => Promise<T>,
  ): Promise<T>;
}
