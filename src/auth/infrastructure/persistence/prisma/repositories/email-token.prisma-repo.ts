import { Injectable } from '@nestjs/common';
import { EmailTokenRepository } from '@auth/domain/repositories/email-token.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EmailTokenPrismaRepository implements EmailTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prisma.emailVerificationToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async consume(token: string): Promise<string | null> {
    const row = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
    if (!row || row.expiresAt < new Date()) return null;

    await this.prisma.emailVerificationToken.delete({ where: { id: row.id } });
    return row.userId;
  }
}
