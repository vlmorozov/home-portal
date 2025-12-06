import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { OAuthAccountOrmEntity } from './infrastructure/persistence/entities/oauth-account.orm-entity';
import { EmailVerificationTokenOrmEntity } from './infrastructure/persistence/entities/email-verification-token.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/entities/refresh-token.orm-entity';
import { PinoLoggerModule } from './common/logger/pino.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    PinoLoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('db.host'),
        port: cfg.get('db.port'),
        username: cfg.get('db.user'),
        password: cfg.get('db.password'),
        database: cfg.get('db.name'),
        autoLoadEntities: true,
        synchronize: false,
        migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
        migrationsRun: true,
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity, OAuthAccountOrmEntity, EmailVerificationTokenOrmEntity, RefreshTokenOrmEntity]),
    AuthModule,
  ],
})
export class AppModule {}
