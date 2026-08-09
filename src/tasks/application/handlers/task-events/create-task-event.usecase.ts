import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, TASK_STATUSES } from '@tasks/domain/task-event.entity';
import {
  TaskUnitOfWork,
  TASK_UNIT_OF_WORK,
} from '@tasks/domain/repositories/task-unit-of-work';

@Injectable()
export class CreateTaskEventUseCase {
  private readonly logger = new Logger(CreateTaskEventUseCase.name);

  constructor(
    @Inject(TASK_UNIT_OF_WORK) private readonly unitOfWork: TaskUnitOfWork,
  ) {}

  async execute(input: {
    taskId: string;
    userId: string;
    status: TaskStatus;
    dueDate?: Date | null;
  }) {
    if (!TASK_STATUSES.includes(input.status)) {
      throw new BadRequestException('INVALID_STATUS');
    }

    const event = await this.unitOfWork.transaction(
      async ({ tasks, taskEvents }) => {
        const task = await tasks.findById(input.taskId, input.userId);
        if (!task) return null;

        return taskEvents.create({
          taskId: input.taskId,
          userId: input.userId,
          status: input.status,
          dueDate: input.dueDate ?? null,
        });
      },
    );

    if (!event) throw new NotFoundException('TASK_NOT_FOUND');
    this.logger.log(
      `Task event created ${event.id} for task ${input.taskId} by user ${input.userId}`,
    );
    return event;
  }
}
