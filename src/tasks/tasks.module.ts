import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrmEntity } from './infrastructure/persistence/typeorm/entities/task.orm-entity';
import { TaskEventOrmEntity } from './infrastructure/persistence/typeorm/entities/task-event.orm-entity';
import { TaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task.typeorm-repo';
import { TaskEventTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task-event.typeorm-repo';
import { TaskTypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/task-unit-of-work.typeorm';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { TASK_EVENT_REPOSITORY } from './domain/repositories/task-event.repository';
import { TASK_UNIT_OF_WORK } from './domain/repositories/task-unit-of-work';
import { CreateTaskUseCase } from './application/handlers/create-task.usecase';
import { ListTasksUseCase } from './application/handlers/list-tasks.usecase';
import { GetTaskUseCase } from './application/handlers/get-task.usecase';
import { UpdateTaskUseCase } from './application/handlers/update-task.usecase';
import { DeleteTaskUseCase } from './application/handlers/delete-task.usecase';
import { CreateTaskEventUseCase } from './application/handlers/create-task-event.usecase';
import { ListTaskEventsUseCase } from './application/handlers/list-task-events.usecase';
import { GetTaskEventUseCase } from './application/handlers/get-task-event.usecase';
import { GetLatestTaskEventUseCase } from './application/handlers/get-latest-task-event.usecase';
import { TaskController } from './presentation/tasks.controller';
import { TaskEventsController } from './presentation/task-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity, TaskEventOrmEntity])],
  controllers: [TaskController, TaskEventsController],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskTypeOrmRepository },
    { provide: TASK_EVENT_REPOSITORY, useClass: TaskEventTypeOrmRepository },
    { provide: TASK_UNIT_OF_WORK, useClass: TaskTypeOrmUnitOfWork },
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    CreateTaskEventUseCase,
    ListTaskEventsUseCase,
    GetTaskEventUseCase,
    GetLatestTaskEventUseCase,
  ],
})
export class TasksModule {}
