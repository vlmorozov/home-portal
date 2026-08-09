import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '@tasks/domain/repositories/task-list.repository';
import { TaskTitle } from '@tasks/domain/value-objects/task-title.vo';

@Injectable()
export class UpdateTaskListUseCase {
  private readonly logger = new Logger(UpdateTaskListUseCase.name);

  constructor(
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(
    taskListId: string,
    userId: string,
    updates: {
      title?: string;
      description?: string | null;
    },
  ) {
    const taskList = await this.taskLists.update(taskListId, userId, {
      title:
        updates.title !== undefined
          ? this.createTitle(updates.title)
          : undefined,
      description: updates.description,
    });
    if (!taskList) throw new NotFoundException('TASK_LIST_NOT_FOUND');

    this.logger.log(`Task list updated ${taskListId} by user ${userId}`);
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
