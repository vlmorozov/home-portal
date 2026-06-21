import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from '../../shared/utils/current-user-id.decorator';
import { CreateTaskEventUseCase } from '../application/handlers/create-task-event.usecase';
import { GetLatestTaskEventUseCase } from '../application/handlers/get-latest-task-event.usecase';
import { GetTaskEventUseCase } from '../application/handlers/get-task-event.usecase';
import { ListTaskEventsUseCase } from '../application/handlers/list-task-events.usecase';
import { CreateTaskEventDto } from './dto/create-task-event.dto';

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

  @Get(':eventId')
  get(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.getTaskEventUC.execute(eventId, userId, taskId);
  }
}
