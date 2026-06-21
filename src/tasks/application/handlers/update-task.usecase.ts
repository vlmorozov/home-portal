import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  TaskUnitOfWork,
  TASK_UNIT_OF_WORK,
} from '../../domain/repositories/task-unit-of-work';
import { TaskTitle } from '../../domain/value-objects/task-title.vo';

@Injectable()
export class UpdateTaskUseCase {
  private readonly logger = new Logger(UpdateTaskUseCase.name);

  constructor(
    @Inject(TASK_UNIT_OF_WORK) private readonly unitOfWork: TaskUnitOfWork,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    updates: {
      title?: string;
      description?: string | null;
    },
  ) {
    const title =
      updates.title !== undefined ? this.createTitle(updates.title) : undefined;
    const task = await this.unitOfWork.transaction(async ({ tasks }) => {
      const updatedTask = await tasks.update(taskId, userId, {
        title,
        description: updates.description,
      });
      if (!updatedTask) return null;

      return updatedTask;
    });
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');
    this.logger.log(`Task updated ${taskId} by user ${userId}`);
    return task;
  }

  private createTitle(title: string): string {
    try {
      return new TaskTitle(title).value;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
