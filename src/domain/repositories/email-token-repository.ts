export const EMAIL_TOKEN_REPOSITORY = Symbol('EMAIL_TOKEN_REPOSITORY');

export interface EmailTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<void>;
  consume(token: string): Promise<string | null>;
}
