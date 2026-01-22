import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shopping')
@Controller('shopping')
export class ShoppingController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
