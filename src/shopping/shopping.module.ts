import { Module } from '@nestjs/common';
import { ShoppingController } from './presentation/shopping.controller';

@Module({
  controllers: [ShoppingController],
})
export class ShoppingModule {}
