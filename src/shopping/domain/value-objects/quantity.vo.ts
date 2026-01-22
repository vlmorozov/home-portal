import { ValueObject } from '../../../shared/domain/value-object';

export class Quantity extends ValueObject<number> {
  constructor(value: number) {
    if (value <= 0) throw new Error('INVALID_QUANTITY');
    super(value);
  }
}
