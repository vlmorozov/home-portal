import { Inject, Injectable, Logger } from '@nestjs/common';
import { TaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository';

@Injectable()
export class ListTasksUseCase {
  private readonly logger = new Logger(ListTasksUseCase.name);
  constructor(@Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository) {}

  async execute(userId: string) {
    this.logger.log(`Listing tasks for user ${userId}`);
    return this.tasks.findAllForUser(userId);
  }
}
