import { ValueObject } from '../../../shared/domain/value-object';

export class TaskTitle extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim());
    if (!this.value) throw new Error('TASK_TITLE_REQUIRED');
    if (this.value.length > 200) throw new Error('TASK_TITLE_TOO_LONG');
  }
}
