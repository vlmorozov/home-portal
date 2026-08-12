import { Injectable } from '@nestjs/common';
import { User } from '@auth/domain/user.entity';
import { UserRepository } from '@auth/domain/repositories/user.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type UserRow = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { phone } });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(user: User | Partial<User>): Promise<User> {
    const data = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      emailVerified: user.emailVerified,
    };

    const row = user.id
      ? await this.prisma.user.update({
          where: { id: user.id },
          data: this.withoutUndefined(data),
        })
      : await this.prisma.user.create({
          data: {
            username: user.username!,
            email: user.email!,
            phone: user.phone ?? null,
            passwordHash: user.passwordHash ?? null,
            emailVerified: user.emailVerified ?? false,
          },
        });

    return this.toDomain(row);
  }

  private withoutUndefined<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(([, entry]) => entry !== undefined),
    ) as Partial<T>;
  }

  private toDomain(row: UserRow): User {
    return new User(
      row.id,
      row.username,
      row.email,
      row.phone,
      row.passwordHash,
      row.emailVerified,
      row.createdAt,
      row.updatedAt,
    );
  }
}
