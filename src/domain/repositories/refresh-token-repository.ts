import { RefreshToken } from '../entities/refresh-token';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  save(token: Partial<RefreshToken>): Promise<RefreshToken>;
  findValid(token: string): Promise<RefreshToken | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
