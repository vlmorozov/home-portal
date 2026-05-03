export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('PASSWORD_RESET_TOKEN_REPOSITORY');

export type PasswordResetChannel = 'email' | 'phone';

export interface PasswordResetTokenRepository {
  create(userId: string, token: string, expiresAt: Date, channel: PasswordResetChannel): Promise<void>;
  consume(token: string): Promise<{ userId: string; channel: PasswordResetChannel } | null>;
}
