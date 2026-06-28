import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskListDto {
  @ApiPropertyOptional({ example: 'Home chores and errands' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated list description' })
  @IsOptional()
  @IsString()
  description?: string;
}
