import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../services/password-hasher';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginEmailUseCase {
  private readonly logger = new Logger(LoginEmailUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: { email: string; password: string }): Promise<{ accessToken: string; userId: string }> {
    this.logger.log(`Attempting login via email for ${input.email}`);
    const user = await this.users.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      this.logger.warn('User not found or missing password hash');
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }
    const ok = await this.hasher.compare(input.password, user.passwordHash);
    if (!ok) {
      this.logger.warn('Password comparison failed');
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }
    this.logger.log(`Login succeeded for ${input.email}`);
    return { accessToken: this.tokens.access(user.id, user.email), userId: user.id };
  }
}
