import { BaseEntity } from './base.entity';
import { DomainEvent } from './domain-event';

export abstract class AggregateRoot<ID = string> extends BaseEntity<ID> {
  private readonly domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
