import { ValueObject } from '@shared/domain/value-object';

export class Money extends ValueObject<number> {
  constructor(value: number) {
    if (Number.isNaN(value)) throw new Error('INVALID_MONEY');
    super(value);
  }
}
