export type ItemId = string;

export class Item {
  constructor(
    public readonly id: ItemId,
    public name: string,
    public quantity: number,
    public unit: string,
    public purchased: boolean = false,
  ) {}
}
