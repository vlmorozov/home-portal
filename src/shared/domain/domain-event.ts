export interface DomainEvent {
  readonly occurredOn: Date;
  readonly name?: string;
}
