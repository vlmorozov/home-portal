import { Module } from '@nestjs/common';
import { TaskPrismaRepository } from './infrastructure/persistence/prisma/repositories/task.prisma-repo';
import { TaskEventPrismaRepository } from './infrastructure/persistence/prisma/repositories/task-event.prisma-repo';
import { SubtaskPrismaRepository } from './infrastructure/persistence/prisma/repositories/subtask.prisma-repo';
import { TaskListPrismaRepository } from './infrastructure/persistence/prisma/repositories/task-list.prisma-repo';
import { TaskListTaskPrismaRepository } from './infrastructure/persistence/prisma/repositories/task-list-task.prisma-repo';
import { TaskPrismaUnitOfWork } from './infrastructure/persistence/prisma/task-unit-of-work.prisma';
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
  imports: [],
  controllers: [
    TaskController,
    TaskEventsController,
    SubtasksController,
    TaskListsController,
  ],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskPrismaRepository },
    { provide: TASK_EVENT_REPOSITORY, useClass: TaskEventPrismaRepository },
    { provide: SUBTASK_REPOSITORY, useClass: SubtaskPrismaRepository },
    { provide: TASK_LIST_REPOSITORY, useClass: TaskListPrismaRepository },
    {
      provide: TASK_LIST_TASK_REPOSITORY,
      useClass: TaskListTaskPrismaRepository,
    },
    { provide: TASK_UNIT_OF_WORK, useClass: TaskPrismaUnitOfWork },
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
