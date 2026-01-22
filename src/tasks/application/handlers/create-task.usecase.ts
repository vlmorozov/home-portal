import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { TaskStatus, TASK_STATUSES } from '../../domain/task.entity';
import { TaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);
  constructor(@Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository) {}

  async execute(input: {
    userId: string;
    title: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: Date | null;
  }) {
    const status = input.status ?? 'pending';
    if (!TASK_STATUSES.includes(status)) throw new BadRequestException('INVALID_STATUS');
    const task = await this.tasks.create({
      userId: input.userId,
      title: input.title,
      description: input.description ?? null,
      status,
      dueDate: input.dueDate ?? null,
    });
    this.logger.log(`Task created ${task.id} by user ${input.userId}`);
    return task;
  }
}
