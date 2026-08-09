import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '@tasks/domain/repositories/task-list.repository';
import { TaskTitle } from '@tasks/domain/value-objects/task-title.vo';

@Injectable()
export class CreateTaskListUseCase {
  private readonly logger = new Logger(CreateTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(input: {
    userId: string;
    title: string;
    description?: string | null;
  }) {
    const taskList = await this.taskLists.create({
      userId: input.userId,
      title: this.createTitle(input.title),
      description: input.description ?? null,
    });

    this.logger.log(`Task list created ${taskList.id} by user ${input.userId}`);
    return taskList;
  }

  private createTitle(title: string): string {
    try {
      return new TaskTitle(title).value;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
