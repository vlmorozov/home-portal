import { ValueObject } from '@shared/domain/value-object';

export class Category extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim());
    if (!this.value) throw new Error('INVALID_CATEGORY');
  }
}
