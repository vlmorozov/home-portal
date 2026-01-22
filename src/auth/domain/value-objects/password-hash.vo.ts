import { ValueObject } from '../../../shared/domain/value-object';

export class PasswordHash extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    if (!this.value) throw new Error('INVALID_PASSWORD_HASH');
  }
}
