import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token-repository';

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshRepo: RefreshTokenRepository) {}
  async execute(refreshToken: string): Promise<void> {
    await this.refreshRepo.revoke(refreshToken);
  }
}
