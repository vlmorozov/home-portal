import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTokenRepository } from '../../../domain/repositories/email-token-repository';
import { EmailVerificationTokenOrmEntity } from '../entities/email-verification-token.orm-entity';

@Injectable()
export class EmailTokenTypeOrmRepository implements EmailTokenRepository {
  constructor(@InjectRepository(EmailVerificationTokenOrmEntity) private repo: Repository<EmailVerificationTokenOrmEntity>) {}
  async create(userId: string, token: string, expiresAt: Date) { await this.repo.save({ userId, token, expiresAt }); }
  async consume(token: string) {
    const row = await this.repo.findOne({ where: { token } });
    if (!row || row.expiresAt < new Date()) return null;
    await this.repo.delete({ id: row.id });
    return row.userId;
  }
}
