import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSubtaskDto {
  @ApiPropertyOptional({ example: '2d4c77f5-9b86-4f99-b8fa-7ef8cc6b7bc4' })
  @IsOptional()
  @IsUUID()
  taskId?: string;
}
