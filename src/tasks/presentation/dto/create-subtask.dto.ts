import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubtaskDto {
  @ApiProperty({ example: '2d4c77f5-9b86-4f99-b8fa-7ef8cc6b7bc4' })
  @IsUUID()
  taskId!: string;
}
