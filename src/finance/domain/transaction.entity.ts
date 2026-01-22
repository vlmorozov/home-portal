export type TransactionId = string;

export class Transaction {
  constructor(
    public readonly id: TransactionId,
    public readonly userId: string,
    public amount: number,
    public category: string,
    public occurredAt: Date,
    public note?: string | null,
  ) {}
}
