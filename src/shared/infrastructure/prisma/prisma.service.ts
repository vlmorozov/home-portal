import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const databaseUrl =
      config.get<string>('db.url') ??
      `postgresql://${encodeURIComponent(config.get<string>('db.user') ?? '')}:${encodeURIComponent(
        config.get<string>('db.password') ?? '',
      )}@${config.get<string>('db.host')}:${config.get<number>('db.port')}/${config.get<string>('db.name')}`;

    super({
      adapter: new PrismaPg(databaseUrl),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
