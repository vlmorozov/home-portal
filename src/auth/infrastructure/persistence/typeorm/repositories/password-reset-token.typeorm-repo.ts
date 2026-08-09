import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetTokenRepository, PasswordResetChannel } from '@auth/domain/repositories/password-reset-token.repository';
import { PasswordResetTokenOrmEntity } from '../entities/password-reset-token.orm-entity';

@Injectable()
export class PasswordResetTokenTypeOrmRepository implements PasswordResetTokenRepository {
  constructor(@InjectRepository(PasswordResetTokenOrmEntity) private repo: Repository<PasswordResetTokenOrmEntity>) {}

  async create(userId: string, token: string, expiresAt: Date, channel: PasswordResetChannel) {
    await this.repo.save({ userId, token, expiresAt, channel });
  }

  async consume(token: string) {
    const row = await this.repo.findOne({ where: { token } });
    if (!row || row.expiresAt < new Date()) return null;
    await this.repo.delete({ id: row.id });
    return { userId: row.userId, channel: row.channel as PasswordResetChannel };
  }
}
