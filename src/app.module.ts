import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/infrastructure/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PinoLoggerModule } from './shared/infrastructure/logger/pino.module';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { FinanceModule } from './finance/finance.module';
import { ShoppingModule } from './shopping/shopping.module';

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
    AuthModule,
    TasksModule,
    FinanceModule,
    ShoppingModule,
  ],
})
export class AppModule {}
