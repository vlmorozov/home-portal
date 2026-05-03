import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { EmailService } from '../services/email.service';
import { PasswordResetTokenRepository, PASSWORD_RESET_TOKEN_REPOSITORY } from '../../domain/repositories/password-reset-token.repository';

@Injectable()
export class RequestPasswordResetEmailUseCase {
  private readonly logger = new Logger(RequestPasswordResetEmailUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY) private readonly tokens: PasswordResetTokenRepository,
    private readonly email: EmailService,
  ) {}

  async execute(input: { email: string }): Promise<void> {
    this.logger.log(`Password reset requested by email: ${input.email}`);
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      this.logger.warn('No user found for email reset request');
      return;
    }
    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await this.tokens.create(user.id, token, expiresAt, 'email');
    await this.email.sendPasswordReset(user.email, token);
    this.logger.log(`Password reset token issued for user ${user.id}`);
  }
}
