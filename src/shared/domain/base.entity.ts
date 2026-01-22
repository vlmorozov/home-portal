export abstract class BaseEntity<ID = string> {
  protected constructor(public readonly id: ID) {}
}
