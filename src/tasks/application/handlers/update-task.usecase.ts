import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus, TASK_STATUSES } from '../../domain/task.entity';
import { TaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository';

@Injectable()
export class UpdateTaskUseCase {
  private readonly logger = new Logger(UpdateTaskUseCase.name);
  constructor(@Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository) {}

  async execute(taskId: string, userId: string, updates: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: Date | null;
  }) {
    if (updates.status && !TASK_STATUSES.includes(updates.status)) {
      throw new BadRequestException('INVALID_STATUS');
    }
    const task = await this.tasks.update(taskId, userId, updates);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');
    this.logger.log(`Task updated ${taskId} by user ${userId}`);
    return task;
  }
}
