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
export class CreateSubtaskUseCase {
  private readonly logger = new Logger(CreateSubtaskUseCase.name);

  constructor(
    @Inject(SUBTASK_REPOSITORY) private readonly subtasks: SubtaskRepository,
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
  ) {}

  async execute(input: {
    parentTaskId: string;
    userId: string;
    taskId: string;
  }) {
    if (input.taskId === input.parentTaskId) {
      throw new BadRequestException('SUBTASK_SELF_REFERENCE');
    }

    const parentTask = await this.tasks.findById(
      input.parentTaskId,
      input.userId,
    );
    if (!parentTask) throw new NotFoundException('TASK_NOT_FOUND');

    const childTask = await this.tasks.findById(input.taskId, input.userId);
    if (!childTask) throw new NotFoundException('SUBTASK_TASK_NOT_FOUND');

    const subtask = await this.subtasks.create({
      taskId: input.taskId,
      parentTaskId: input.parentTaskId,
      userId: input.userId,
    });

    this.logger.log(
      `Subtask created ${subtask.id} for task ${input.parentTaskId} by user ${input.userId}`,
    );
    return subtask;
  }
}
