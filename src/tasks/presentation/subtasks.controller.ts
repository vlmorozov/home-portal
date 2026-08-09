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
import { CreateSubtaskUseCase } from '../application/handlers/subtasks/create-subtask.usecase';
import { DeleteSubtaskUseCase } from '../application/handlers/subtasks/delete-subtask.usecase';
import { GetSubtaskUseCase } from '../application/handlers/subtasks/get-subtask.usecase';
import { ListSubtasksUseCase } from '../application/handlers/subtasks/list-subtasks.usecase';
import { UpdateSubtaskUseCase } from '../application/handlers/subtasks/update-subtask.usecase';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@ApiTags('subtasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'tasks/:taskId/subtasks', version: '1' })
export class SubtasksController {
  constructor(
    private readonly createSubtaskUC: CreateSubtaskUseCase,
    private readonly listSubtasksUC: ListSubtasksUseCase,
    private readonly getSubtaskUC: GetSubtaskUseCase,
    private readonly updateSubtaskUC: UpdateSubtaskUseCase,
    private readonly deleteSubtaskUC: DeleteSubtaskUseCase,
  ) {}

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.createSubtaskUC.execute({
      parentTaskId: taskId,
      userId,
      taskId: dto.taskId,
    });
  }

  @Get()
  list(@CurrentUserId() userId: string, @Param('taskId') taskId: string) {
    return this.listSubtasksUC.execute(taskId, userId);
  }

  @Get(':subtaskId')
  get(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.getSubtaskUC.execute(taskId, subtaskId, userId);
  }

  @Put(':subtaskId')
  update(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.updateSubtaskUC.execute(taskId, subtaskId, userId, {
      taskId: dto.taskId,
    });
  }

  @Delete(':subtaskId')
  @HttpCode(204)
  async delete(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    await this.deleteSubtaskUC.execute(taskId, subtaskId, userId);
    return {};
  }
}
