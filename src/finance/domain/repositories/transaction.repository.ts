import { Transaction, TransactionId } from '../transaction.entity';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionRepository {
  save(tx: Partial<Transaction>): Promise<Transaction>;
  findById(id: TransactionId, userId: string): Promise<Transaction | null>;
  findAllForUser(userId: string): Promise<Transaction[]>;
  delete(id: TransactionId, userId: string): Promise<void>;
}
