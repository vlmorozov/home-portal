import { AggregateRoot } from '@shared/domain/aggregate-root';
import { Transaction } from './transaction.entity';

export class TransactionAggregate extends AggregateRoot<string> {
  constructor(public readonly transaction: Transaction) {
    super(transaction.id);
  }
}
