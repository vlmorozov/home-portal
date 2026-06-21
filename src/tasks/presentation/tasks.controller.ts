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
import { CurrentUserId } from '../../shared/utils/current-user-id.decorator';
import { TaskStatus } from '../domain/task-event.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskUseCase } from '../application/handlers/create-task.usecase';
import { ListTasksUseCase } from '../application/handlers/list-tasks.usecase';
import { GetTaskUseCase } from '../application/handlers/get-task.usecase';
import { UpdateTaskUseCase } from '../application/handlers/update-task.usecase';
import { DeleteTaskUseCase } from '../application/handlers/delete-task.usecase';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(
    private readonly createTaskUC: CreateTaskUseCase,
    private readonly listTasksUC: ListTasksUseCase,
    private readonly getTaskUC: GetTaskUseCase,
    private readonly updateTaskUC: UpdateTaskUseCase,
    private readonly deleteTaskUC: DeleteTaskUseCase,
  ) {}

  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateTaskDto) {
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return this.createTaskUC.execute({
      userId,
      title: dto.title,
      description: dto.description ?? null,
    });
  }

  @Get()
  list(@CurrentUserId() userId: string) {
    return this.listTasksUC.execute(userId);
  }

  @Get(':id')
  get(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.getTaskUC.execute(id, userId);
  }

  @Put(':id')
  update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const updates: {
      title?: string;
      description?: string | null;
    } = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    return this.updateTaskUC.execute(id, userId, updates);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    await this.deleteTaskUC.execute(id, userId);
    return {};
  }
}
