import { User, UserId } from '../entities/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  save(user: User | Partial<User>): Promise<User>;
}
