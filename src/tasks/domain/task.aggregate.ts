import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Task } from './task.entity';

export class TaskAggregate extends AggregateRoot<string> {
  constructor(public readonly task: Task) {
    super(task.id);
  }
}
