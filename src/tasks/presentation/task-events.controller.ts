import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from '@shared/utils/current-user-id.decorator';
import { CreateTaskEventUseCase } from '../application/handlers/task-events/create-task-event.usecase';
import { DeleteTaskEventUseCase } from '../application/handlers/task-events/delete-task-event.usecase';
import { GetLatestTaskEventUseCase } from '../application/handlers/task-events/get-latest-task-event.usecase';
import { GetTaskEventUseCase } from '../application/handlers/task-events/get-task-event.usecase';
import { ListTaskEventsUseCase } from '../application/handlers/task-events/list-task-events.usecase';
import { UpdateTaskEventUseCase } from '../application/handlers/task-events/update-task-event.usecase';
import { CreateTaskEventDto } from './dto/create-task-event.dto';
import { UpdateTaskEventDto } from './dto/update-task-event.dto';

@ApiTags('task-events')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'tasks/:taskId/events', version: '1' })
export class TaskEventsController {
  constructor(
    private readonly createTaskEventUC: CreateTaskEventUseCase,
    private readonly listTaskEventsUC: ListTaskEventsUseCase,
    private readonly getTaskEventUC: GetTaskEventUseCase,
    private readonly getLatestTaskEventUC: GetLatestTaskEventUseCase,
    private readonly updateTaskEventUC: UpdateTaskEventUseCase,
    private readonly deleteTaskEventUC: DeleteTaskEventUseCase,
  ) {}

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskEventDto,
  ) {
    return this.createTaskEventUC.execute({
      taskId,
      userId,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
  }

  @Get()
  list(@CurrentUserId() userId: string, @Param('taskId') taskId: string) {
    return this.listTaskEventsUC.execute(taskId, userId);
  }

  @Get('latest')
  latest(@CurrentUserId() userId: string, @Param('taskId') taskId: string) {
    return this.getLatestTaskEventUC.execute(taskId, userId);
  }

  @Get(':taskEventId')
  get(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('taskEventId') taskEventId: string,
  ) {
    return this.getTaskEventUC.execute(taskEventId, userId, taskId);
  }

  @Put(':taskEventId')
  update(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('taskEventId') taskEventId: string,
    @Body() dto: UpdateTaskEventDto,
  ) {
    return this.updateTaskEventUC.execute(taskId, taskEventId, userId, {
      status: dto.status,
      dueDate:
        dto.dueDate !== undefined
          ? dto.dueDate
            ? new Date(dto.dueDate)
            : null
          : undefined,
    });
  }

  @Delete(':taskEventId')
  @HttpCode(204)
  async delete(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('taskEventId') taskEventId: string,
  ) {
    await this.deleteTaskEventUC.execute(taskId, taskEventId, userId);
    return {};
  }
}
