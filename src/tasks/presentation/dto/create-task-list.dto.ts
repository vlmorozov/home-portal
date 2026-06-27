import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskListDto {
  @ApiProperty({ example: 'Home chores' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Tasks for this week' })
  @IsOptional()
  @IsString()
  description?: string;
}
