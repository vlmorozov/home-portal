import { ShoppingListAggregate } from '../shopping-list.aggregate';

export const SHOPPING_LIST_REPOSITORY = Symbol('SHOPPING_LIST_REPOSITORY');

export interface ShoppingListRepository {
  save(list: ShoppingListAggregate): Promise<ShoppingListAggregate>;
  findById(id: string, userId: string): Promise<ShoppingListAggregate | null>;
  findAllForUser(userId: string): Promise<ShoppingListAggregate[]>;
  delete(id: string, userId: string): Promise<void>;
}
