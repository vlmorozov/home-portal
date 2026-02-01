import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { PasswordResetTokenRepository, PASSWORD_RESET_TOKEN_REPOSITORY } from '../../domain/repositories/password-reset-token.repository';
import { SmsService } from '../services/sms.service';

@Injectable()
export class RequestPasswordResetPhoneUseCase {
  private readonly logger = new Logger(RequestPasswordResetPhoneUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY) private readonly tokens: PasswordResetTokenRepository,
    private readonly sms: SmsService,
  ) {}

  async execute(input: { phone: string }): Promise<void> {
    this.logger.log(`Password reset requested by phone: ${input.phone}`);
    const user = await this.users.findByPhone(input.phone);
    if (!user) {
      this.logger.warn('No user found for phone reset request');
      return;
    }
    const token = String(randomInt(0, 1000000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    await this.tokens.create(user.id, token, expiresAt, 'phone');
    await this.sms.sendPasswordReset(user.phone as string, token);
    this.logger.log(`Password reset code issued for user ${user.id}`);
  }
}
