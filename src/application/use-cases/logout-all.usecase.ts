import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token-repository';

@Injectable()
export class LogoutAllUseCase {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshRepo: RefreshTokenRepository) {}
  async execute(userId: string): Promise<void> {
    await this.refreshRepo.revokeAllForUser(userId);
  }
}
