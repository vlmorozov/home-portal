import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@auth/domain/refresh-token.entity';
import { RefreshTokenRepository } from '@auth/domain/repositories/refresh-token.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type RefreshTokenRow = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
};

@Injectable()
export class RefreshTokenPrismaRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(token: Partial<RefreshToken>): Promise<RefreshToken> {
    const row = await this.prisma.refreshToken.create({
      data: {
        userId: token.userId!,
        token: token.token!,
        expiresAt: token.expiresAt!,
        revokedAt: token.revokedAt,
      },
    });
    return this.toDomain(row);
  }

  async findValid(token: string): Promise<RefreshToken | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { token, revokedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async revoke(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
  }

  private toDomain(row: RefreshTokenRow): RefreshToken {
    return new RefreshToken(
      row.id,
      row.userId,
      row.token,
      row.expiresAt,
      row.createdAt,
      row.revokedAt,
    );
  }
}
