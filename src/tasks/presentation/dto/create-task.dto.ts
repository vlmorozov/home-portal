import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus, TASK_STATUSES } from '../../domain/task-event.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString() @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Eggs, milk, and bread' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TASK_STATUSES, example: 'pending' })
  @IsOptional() @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ApiPropertyOptional({ format: 'date-time', example: '2024-12-31T18:00:00Z' })
  @IsOptional() @IsDateString()
  dueDate?: string;
}
