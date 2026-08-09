import { AggregateRoot } from '@shared/domain/aggregate-root';
import { User } from './user.entity';

export class UserAggregate extends AggregateRoot<string> {
  constructor(public readonly user: User) {
    super(user.id);
  }
}
