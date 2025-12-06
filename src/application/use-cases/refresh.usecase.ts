import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token-repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshRepo: RefreshTokenRepository,
    private readonly tokens: TokenService,
  ) {}
  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    const rt = await this.refreshRepo.findValid(refreshToken);
    if (!rt) throw new Error('INVALID_REFRESH');
    // Optional rotation: revoke current and issue a new on controller level if needed.
    return { accessToken: this.tokens.access(rt.userId) };
  }
}
