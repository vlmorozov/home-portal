import { ValueObject } from '@shared/domain/value-object';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim().toLowerCase());
    if (!EMAIL_REGEX.test(this.value)) {
      throw new Error('INVALID_EMAIL');
    }
  }
}
