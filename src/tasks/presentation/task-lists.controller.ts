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
import { AddTaskToTaskListUseCase } from '../application/handlers/task-lists/add-task-to-task-list.usecase';
import { CreateTaskListUseCase } from '../application/handlers/task-lists/create-task-list.usecase';
import { DeleteTaskListUseCase } from '../application/handlers/task-lists/delete-task-list.usecase';
import { GetTaskListUseCase } from '../application/handlers/task-lists/get-task-list.usecase';
import { ListTaskListTasksUseCase } from '../application/handlers/task-lists/list-task-list-tasks.usecase';
import { ListTaskListsUseCase } from '../application/handlers/task-lists/list-task-lists.usecase';
import { RemoveTaskFromTaskListUseCase } from '../application/handlers/task-lists/remove-task-from-task-list.usecase';
import { UpdateTaskListUseCase } from '../application/handlers/task-lists/update-task-list.usecase';
import { AddTaskToTaskListDto } from './dto/add-task-to-task-list.dto';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';

@ApiTags('task-lists')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'task-lists', version: '1' })
export class TaskListsController {
  constructor(
    private readonly createTaskListUC: CreateTaskListUseCase,
    private readonly listTaskListsUC: ListTaskListsUseCase,
    private readonly getTaskListUC: GetTaskListUseCase,
    private readonly updateTaskListUC: UpdateTaskListUseCase,
    private readonly deleteTaskListUC: DeleteTaskListUseCase,
    private readonly addTaskToTaskListUC: AddTaskToTaskListUseCase,
    private readonly listTaskListTasksUC: ListTaskListTasksUseCase,
    private readonly removeTaskFromTaskListUC: RemoveTaskFromTaskListUseCase,
  ) {}

  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateTaskListDto) {
    return this.createTaskListUC.execute({
      userId,
      title: dto.title,
      description: dto.description ?? null,
    });
  }

  @Get()
  list(@CurrentUserId() userId: string) {
    return this.listTaskListsUC.execute(userId);
  }

  @Get(':id')
  get(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.getTaskListUC.execute(id, userId);
  }

  @Put(':id')
  update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskListDto,
  ) {
    return this.updateTaskListUC.execute(id, userId, {
      title: dto.title,
      description: dto.description,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    await this.deleteTaskListUC.execute(id, userId);
    return {};
  }

  @Post(':id/tasks')
  addTask(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: AddTaskToTaskListDto,
  ) {
    return this.addTaskToTaskListUC.execute({
      taskListId: id,
      taskId: dto.taskId,
      userId,
    });
  }

  @Get(':id/tasks')
  listTasks(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.listTaskListTasksUC.execute(id, userId);
  }

  @Delete(':id/tasks/:taskId')
  @HttpCode(204)
  async removeTask(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ) {
    await this.removeTaskFromTaskListUC.execute(id, taskId, userId);
    return {};
  }
}
