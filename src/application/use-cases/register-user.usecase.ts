import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../services/password-hasher';
import { EmailTokenRepository, EMAIL_TOKEN_REPOSITORY } from '../../domain/repositories/email-token-repository';
import { EmailService } from '../services/email.service';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(RegisterUserUseCase.name);
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    @Inject(EMAIL_TOKEN_REPOSITORY) private readonly emailTokens: EmailTokenRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: { username: string; email: string; phone?: string; password: string }): Promise<void> {
    this.logger.log(`Starting registration flow for ${input.email}`);
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new Error('EMAIL_TAKEN');
    this.logger.log('No existing user with this email. Proceeding to create user.');
    const hash = await this.hasher.hash(input.password);
    this.logger.log('Password hashed. Persisting user.');
    const user = await this.users.save({
      id: randomUUID(),
      username: input.username,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash: hash,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    this.logger.log(`User persisted with id ${user.id}. Issuing verification token.`);
    await this.emailTokens.create(user.id, token, expiresAt);
    this.logger.log('Verification token stored. Sending verification email.');
    await this.emailService.sendVerification(user.email, token);
    this.logger.log(`Registration flow completed for ${input.email}`);
  }
}
