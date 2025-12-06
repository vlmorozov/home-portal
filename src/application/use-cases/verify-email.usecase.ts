import { Inject, Injectable } from '@nestjs/common';
import { EmailTokenRepository, EMAIL_TOKEN_REPOSITORY } from '../../domain/repositories/email-token-repository';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user-repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(EMAIL_TOKEN_REPOSITORY) private readonly tokens: EmailTokenRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}
  async execute(token: string): Promise<void> {
    const userId = await this.tokens.consume(token);
    if (!userId) throw new Error('INVALID_TOKEN');
    const user = await this.users.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    user.emailVerified = true;
    user.updatedAt = new Date();
    await this.users.save(user);
  }
}
