import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  TaskListRepository,
  TASK_LIST_REPOSITORY,
} from '../../../domain/repositories/task-list.repository';

@Injectable()
export class ListTaskListsUseCase {
  private readonly logger = new Logger(ListTaskListsUseCase.name);

  constructor(
    @Inject(TASK_LIST_REPOSITORY)
    private readonly taskLists: TaskListRepository,
  ) {}

  async execute(userId: string) {
    this.logger.log(`Listing task lists for user ${userId}`);
    return this.taskLists.findAllForUser(userId);
  }
}
