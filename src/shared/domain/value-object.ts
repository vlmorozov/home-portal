export abstract class ValueObject<T> {
  protected constructor(public readonly value: T) {}

  equals(vo?: ValueObject<T>) {
    if (!vo) return false;
    if (vo.constructor !== this.constructor) return false;
    return vo.value === this.value;
  }
}
