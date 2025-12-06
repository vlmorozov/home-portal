import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token-repository';
import { randomBytes } from 'crypto';

@Injectable()
export class IssueRefreshUseCase {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshRepo: RefreshTokenRepository) {}
  async execute(userId: string): Promise<{ refreshToken: string }> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await this.refreshRepo.save({ userId, token, expiresAt, createdAt: new Date(), revokedAt: null });
    return { refreshToken: token };
  }
}
