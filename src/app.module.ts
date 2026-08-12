import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/infrastructure/config/config.module';
import { AuthModule } from './auth/auth.module';
import { PinoLoggerModule } from './shared/infrastructure/logger/pino.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { FinanceModule } from './finance/finance.module';
import { ShoppingModule } from './shopping/shopping.module';

@Module({
  imports: [
    ConfigModule,
    PinoLoggerModule,
    PrismaModule,
    AuthModule,
    TasksModule,
    FinanceModule,
    ShoppingModule,
  ],
})
export class AppModule {}
