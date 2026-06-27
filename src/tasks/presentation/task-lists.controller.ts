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
import { CreateTaskListUseCase } from '../application/handlers/task-lists/create-task-list.usecase';
import { DeleteTaskListUseCase } from '../application/handlers/task-lists/delete-task-list.usecase';
import { GetTaskListUseCase } from '../application/handlers/task-lists/get-task-list.usecase';
import { ListTaskListsUseCase } from '../application/handlers/task-lists/list-task-lists.usecase';
import { UpdateTaskListUseCase } from '../application/handlers/task-lists/update-task-list.usecase';
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
}
