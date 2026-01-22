import { ValueObject } from '../../../shared/domain/value-object';

export class DueDate extends ValueObject<Date | null> {
  constructor(value: Date | null) {
    super(value);
  }
}
