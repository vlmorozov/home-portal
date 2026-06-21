import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  TaskUnitOfWork,
  TASK_UNIT_OF_WORK,
} from '../../domain/repositories/task-unit-of-work';
import { TaskTitle } from '../../domain/value-objects/task-title.vo';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    @Inject(TASK_UNIT_OF_WORK) private readonly unitOfWork: TaskUnitOfWork,
  ) {}

  async execute(input: {
    userId: string;
    title: string;
    description?: string | null;
  }) {
    const title = this.createTitle(input.title);
    const task = await this.unitOfWork.transaction(async ({ tasks }) => {
      const createdTask = await tasks.create({
        userId: input.userId,
        title,
        description: input.description ?? null,
      });
      return createdTask;
    });
    this.logger.log(`Task created ${task.id} by user ${input.userId}`);
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
