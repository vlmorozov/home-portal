import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
