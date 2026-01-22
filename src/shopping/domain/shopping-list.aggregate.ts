import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Item } from './item.entity';

export class ShoppingListAggregate extends AggregateRoot<string> {
  constructor(public readonly id: string, public readonly userId: string, public items: Item[] = []) {
    super(id);
  }
}
