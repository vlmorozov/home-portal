import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  SubtaskRepository,
  SUBTASK_REPOSITORY,
} from '@tasks/domain/repositories/subtask.repository';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '@tasks/domain/repositories/task.repository';

@Injectable()
export class UpdateSubtaskUseCase {
  private readonly logger = new Logger(UpdateSubtaskUseCase.name);

  constructor(
    @Inject(SUBTASK_REPOSITORY) private readonly subtasks: SubtaskRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(
    parentTaskId: string,
    subtaskId: string,
    userId: string,
    updates: {
      taskId?: string;
    },
  ) {
    if (updates.taskId === undefined) {
      throw new BadRequestException('SUBTASK_UPDATE_REQUIRED');
    }
    if (updates.taskId === parentTaskId) {
      throw new BadRequestException('SUBTASK_SELF_REFERENCE');
    }

    const parentTask = await this.tasks.findById(parentTaskId, userId);
    if (!parentTask) throw new NotFoundException('TASK_NOT_FOUND');

    const childTask = await this.tasks.findById(updates.taskId, userId);
    if (!childTask) throw new NotFoundException('SUBTASK_TASK_NOT_FOUND');

    const subtask = await this.subtasks.update(
      subtaskId,
      userId,
      parentTaskId,
      {
        taskId: updates.taskId,
      },
    );
    if (!subtask) throw new NotFoundException('SUBTASK_NOT_FOUND');

    this.logger.log(
      `Subtask updated ${subtaskId} for task ${parentTaskId} by user ${userId}`,
    );
    return subtask;
  }
}
