import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { TaskStatus, TASK_STATUSES } from '../../domain/task-event.entity';

export class UpdateTaskEventDto {
  @ApiPropertyOptional({ enum: TASK_STATUSES, example: 'completed' })
  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ApiPropertyOptional({
    format: 'date-time',
    nullable: true,
    example: '2025-01-02T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
