import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, TASK_STATUSES } from '@tasks/domain/task-event.entity';
import {
  TaskEventRepository,
  TASK_EVENT_REPOSITORY,
} from '@tasks/domain/repositories/task-event.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '@tasks/domain/repositories/task.repository';

@Injectable()
export class UpdateTaskEventUseCase {
  private readonly logger = new Logger(UpdateTaskEventUseCase.name);

  constructor(
    @Inject(TASK_EVENT_REPOSITORY)
    private readonly taskEvents: TaskEventRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(
    taskId: string,
    taskEventId: string,
    userId: string,
    updates: {
      status?: TaskStatus;
      dueDate?: Date | null;
    },
  ) {
    if (updates.status && !TASK_STATUSES.includes(updates.status)) {
      throw new BadRequestException('INVALID_STATUS');
    }
    if (updates.status === undefined && updates.dueDate === undefined) {
      throw new BadRequestException('TASK_EVENT_UPDATE_REQUIRED');
    }

    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new NotFoundException('TASK_NOT_FOUND');

    const event = await this.taskEvents.update(
      taskEventId,
      userId,
      taskId,
      updates,
    );
    if (!event) throw new NotFoundException('TASK_EVENT_NOT_FOUND');

    this.logger.log(
      `Task event updated ${taskEventId} for task ${taskId} by user ${userId}`,
    );
    return event;
  }
}
