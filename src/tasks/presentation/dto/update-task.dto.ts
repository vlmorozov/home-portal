import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus, TASK_STATUSES } from '../../domain/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Buy groceries and supplies' })
  @IsOptional() @IsString() @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Include cleaning supplies' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TASK_STATUSES, example: 'completed' })
  @IsOptional() @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ApiPropertyOptional({ format: 'date-time', example: '2025-01-02T10:00:00Z' })
  @IsOptional() @IsDateString()
  dueDate?: string;
}
