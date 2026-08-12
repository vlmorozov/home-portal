import { Injectable } from '@nestjs/common';
import {
  PasswordResetChannel,
  PasswordResetTokenRepository,
} from '@auth/domain/repositories/password-reset-token.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PasswordResetTokenPrismaRepository
  implements PasswordResetTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
    channel: PasswordResetChannel,
  ): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: { userId, token, expiresAt, channel },
    });
  }

  async consume(
    token: string,
  ): Promise<{ userId: string; channel: PasswordResetChannel } | null> {
    const row = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!row || row.expiresAt < new Date()) return null;

    await this.prisma.passwordResetToken.delete({ where: { id: row.id } });
    return { userId: row.userId, channel: row.channel as PasswordResetChannel };
  }
}
