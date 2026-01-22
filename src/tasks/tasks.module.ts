import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrmEntity } from './infrastructure/persistence/typeorm/entities/task.orm-entity';
import { TaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task.typeorm-repo';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { CreateTaskUseCase } from './application/handlers/create-task.usecase';
import { ListTasksUseCase } from './application/handlers/list-tasks.usecase';
import { GetTaskUseCase } from './application/handlers/get-task.usecase';
import { UpdateTaskUseCase } from './application/handlers/update-task.usecase';
import { DeleteTaskUseCase } from './application/handlers/delete-task.usecase';
import { TaskController } from './presentation/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TaskController],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskTypeOrmRepository },
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class TasksModule {}
