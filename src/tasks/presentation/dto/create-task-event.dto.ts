import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { TaskStatus, TASK_STATUSES } from '../../domain/task-event.entity';

export class CreateTaskEventDto {
  @ApiProperty({ enum: TASK_STATUSES, example: 'in_progress' })
  @IsIn(TASK_STATUSES)
  status!: TaskStatus;

  @ApiPropertyOptional({
    format: 'date-time',
    example: '2025-01-02T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
