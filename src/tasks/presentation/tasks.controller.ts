import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatus } from '../domain/task.entity';
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
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return this.createTaskUC.execute({
      userId,
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status,
      dueDate,
    });
  }

  @Get()
  list(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    return this.listTasksUC.execute(userId);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    return this.getTaskUC.execute(id, userId);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    const updates: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      dueDate?: Date | null;
    } = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.dueDate !== undefined) updates.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return this.updateTaskUC.execute(id, userId, updates);
  }

  @Delete(':id') @HttpCode(204)
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    await this.deleteTaskUC.execute(id, userId);
    return {};
  }
}
