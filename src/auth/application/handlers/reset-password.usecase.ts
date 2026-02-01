import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher } from '../services/password.service';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { PasswordResetTokenRepository, PASSWORD_RESET_TOKEN_REPOSITORY } from '../../domain/repositories/password-reset-token.repository';

@Injectable()
export class ResetPasswordUseCase {
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY) private readonly tokens: PasswordResetTokenRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: { token: string; newPassword: string }): Promise<void> {
    this.logger.log('Attempting password reset with token');
    const consumed = await this.tokens.consume(input.token);
    if (!consumed) {
      this.logger.warn('Invalid or expired password reset token');
      throw new UnauthorizedException('INVALID_TOKEN');
    }
    const user = await this.users.findById(consumed.userId);
    if (!user) {
      this.logger.warn('User not found for password reset token');
      throw new UnauthorizedException('INVALID_TOKEN');
    }
    const hash = await this.hasher.hash(input.newPassword);
    await this.users.save({ id: user.id, passwordHash: hash, updatedAt: new Date() } as any);
    this.logger.log(`Password reset completed for user ${user.id}`);
  }
}
