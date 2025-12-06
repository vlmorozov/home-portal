import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity';

@Injectable()
export class RefreshTokenTypeOrmRepository implements RefreshTokenRepository {
  constructor(@InjectRepository(RefreshTokenOrmEntity) private repo: Repository<RefreshTokenOrmEntity>) {}
  async save(token: Partial<RefreshTokenOrmEntity>) { return this.repo.save(token); }
  async findValid(token: string) {
    return this.repo.findOne({ where: { token, revokedAt: IsNull() } })
  }
  async revoke(token: string) {
    await this.repo.update({ token }, { revokedAt: new Date() });
  }
  async revokeAllForUser(userId: string) {
    await this.repo.createQueryBuilder().update().set({ revokedAt: () => 'now()' }).where('userId = :userId', { userId }).execute();
  }
}
