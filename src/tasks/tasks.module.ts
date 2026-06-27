import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrmEntity } from './infrastructure/persistence/typeorm/entities/task.orm-entity';
import { TaskEventOrmEntity } from './infrastructure/persistence/typeorm/entities/task-event.orm-entity';
import { SubtaskOrmEntity } from './infrastructure/persistence/typeorm/entities/subtask.orm-entity';
import { TaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task.typeorm-repo';
import { TaskEventTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task-event.typeorm-repo';
import { SubtaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/subtask.typeorm-repo';
import { TaskTypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/task-unit-of-work.typeorm';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { TASK_EVENT_REPOSITORY } from './domain/repositories/task-event.repository';
import { SUBTASK_REPOSITORY } from './domain/repositories/subtask.repository';
import { TASK_UNIT_OF_WORK } from './domain/repositories/task-unit-of-work';
import { CreateTaskUseCase } from './application/handlers/tasks/create-task.usecase';
import { ListTasksUseCase } from './application/handlers/tasks/list-tasks.usecase';
import { GetTaskUseCase } from './application/handlers/tasks/get-task.usecase';
import { UpdateTaskUseCase } from './application/handlers/tasks/update-task.usecase';
import { DeleteTaskUseCase } from './application/handlers/tasks/delete-task.usecase';
import { CreateTaskEventUseCase } from './application/handlers/task-events/create-task-event.usecase';
import { ListTaskEventsUseCase } from './application/handlers/task-events/list-task-events.usecase';
import { GetTaskEventUseCase } from './application/handlers/task-events/get-task-event.usecase';
import { GetLatestTaskEventUseCase } from './application/handlers/task-events/get-latest-task-event.usecase';
import { UpdateTaskEventUseCase } from './application/handlers/task-events/update-task-event.usecase';
import { DeleteTaskEventUseCase } from './application/handlers/task-events/delete-task-event.usecase';
import { CreateSubtaskUseCase } from './application/handlers/subtasks/create-subtask.usecase';
import { ListSubtasksUseCase } from './application/handlers/subtasks/list-subtasks.usecase';
import { GetSubtaskUseCase } from './application/handlers/subtasks/get-subtask.usecase';
import { UpdateSubtaskUseCase } from './application/handlers/subtasks/update-subtask.usecase';
import { DeleteSubtaskUseCase } from './application/handlers/subtasks/delete-subtask.usecase';
import { TaskController } from './presentation/tasks.controller';
import { TaskEventsController } from './presentation/task-events.controller';
import { SubtasksController } from './presentation/subtasks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskOrmEntity,
      TaskEventOrmEntity,
      SubtaskOrmEntity,
    ]),
  ],
  controllers: [TaskController, TaskEventsController, SubtasksController],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskTypeOrmRepository },
    { provide: TASK_EVENT_REPOSITORY, useClass: TaskEventTypeOrmRepository },
    { provide: SUBTASK_REPOSITORY, useClass: SubtaskTypeOrmRepository },
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
    UpdateTaskEventUseCase,
    DeleteTaskEventUseCase,
    CreateSubtaskUseCase,
    ListSubtasksUseCase,
    GetSubtaskUseCase,
    UpdateSubtaskUseCase,
    DeleteSubtaskUseCase,
  ],
})
export class TasksModule {}
