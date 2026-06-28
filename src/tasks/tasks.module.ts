import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrmEntity } from './infrastructure/persistence/typeorm/entities/task.orm-entity';
import { TaskEventOrmEntity } from './infrastructure/persistence/typeorm/entities/task-event.orm-entity';
import { SubtaskOrmEntity } from './infrastructure/persistence/typeorm/entities/subtask.orm-entity';
import { TaskListOrmEntity } from './infrastructure/persistence/typeorm/entities/task-list.orm-entity';
import { TaskListTaskOrmEntity } from './infrastructure/persistence/typeorm/entities/task-list-task.orm-entity';
import { TaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task.typeorm-repo';
import { TaskEventTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task-event.typeorm-repo';
import { SubtaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/subtask.typeorm-repo';
import { TaskListTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task-list.typeorm-repo';
import { TaskListTaskTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/task-list-task.typeorm-repo';
import { TaskTypeOrmUnitOfWork } from './infrastructure/persistence/typeorm/task-unit-of-work.typeorm';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { TASK_EVENT_REPOSITORY } from './domain/repositories/task-event.repository';
import { SUBTASK_REPOSITORY } from './domain/repositories/subtask.repository';
import { TASK_LIST_REPOSITORY } from './domain/repositories/task-list.repository';
import { TASK_LIST_TASK_REPOSITORY } from './domain/repositories/task-list-task.repository';
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
import { CreateTaskListUseCase } from './application/handlers/task-lists/create-task-list.usecase';
import { ListTaskListsUseCase } from './application/handlers/task-lists/list-task-lists.usecase';
import { GetTaskListUseCase } from './application/handlers/task-lists/get-task-list.usecase';
import { UpdateTaskListUseCase } from './application/handlers/task-lists/update-task-list.usecase';
import { DeleteTaskListUseCase } from './application/handlers/task-lists/delete-task-list.usecase';
import { AddTaskToTaskListUseCase } from './application/handlers/task-lists/add-task-to-task-list.usecase';
import { ListTaskListTasksUseCase } from './application/handlers/task-lists/list-task-list-tasks.usecase';
import { RemoveTaskFromTaskListUseCase } from './application/handlers/task-lists/remove-task-from-task-list.usecase';
import { TaskController } from './presentation/tasks.controller';
import { TaskEventsController } from './presentation/task-events.controller';
import { SubtasksController } from './presentation/subtasks.controller';
import { TaskListsController } from './presentation/task-lists.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskOrmEntity,
      TaskEventOrmEntity,
      SubtaskOrmEntity,
      TaskListOrmEntity,
      TaskListTaskOrmEntity,
    ]),
  ],
  controllers: [
    TaskController,
    TaskEventsController,
    SubtasksController,
    TaskListsController,
  ],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskTypeOrmRepository },
    { provide: TASK_EVENT_REPOSITORY, useClass: TaskEventTypeOrmRepository },
    { provide: SUBTASK_REPOSITORY, useClass: SubtaskTypeOrmRepository },
    { provide: TASK_LIST_REPOSITORY, useClass: TaskListTypeOrmRepository },
    {
      provide: TASK_LIST_TASK_REPOSITORY,
      useClass: TaskListTaskTypeOrmRepository,
    },
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
    CreateTaskListUseCase,
    ListTaskListsUseCase,
    GetTaskListUseCase,
    UpdateTaskListUseCase,
    DeleteTaskListUseCase,
    AddTaskToTaskListUseCase,
    ListTaskListTasksUseCase,
    RemoveTaskFromTaskListUseCase,
  ],
})
export class TasksModule {}
