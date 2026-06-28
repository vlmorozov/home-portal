import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TaskEventRepository,
  TASK_EVENT_REPOSITORY,
} from '../../../domain/repositories/task-event.repository';

@Injectable()
export class GetTaskEventUseCase {
  private readonly logger = new Logger(GetTaskEventUseCase.name);

  constructor(
    @Inject(TASK_EVENT_REPOSITORY)
    private readonly taskEvents: TaskEventRepository,
  ) {}

  async execute(eventId: string, userId: string, taskId: string) {
    const event = await this.taskEvents.findById(eventId, userId);
    if (!event || event.taskId !== taskId) {
      throw new NotFoundException('TASK_EVENT_NOT_FOUND');
    }

    this.logger.log(`Task event fetched ${eventId} for user ${userId}`);
    return event;
  }
}
