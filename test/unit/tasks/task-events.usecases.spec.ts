import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTaskEventUseCase } from '../../../src/tasks/application/handlers/task-events/create-task-event.usecase';
import { DeleteTaskEventUseCase } from '../../../src/tasks/application/handlers/task-events/delete-task-event.usecase';
import { GetLatestTaskEventUseCase } from '../../../src/tasks/application/handlers/task-events/get-latest-task-event.usecase';
import { GetTaskEventUseCase } from '../../../src/tasks/application/handlers/task-events/get-task-event.usecase';
import { ListTaskEventsUseCase } from '../../../src/tasks/application/handlers/task-events/list-task-events.usecase';
import { UpdateTaskEventUseCase } from '../../../src/tasks/application/handlers/task-events/update-task-event.usecase';

describe('TaskEvent use cases', () => {
  const userId = 'user-1';
  const taskId = 'task-1';
  const eventId = 'event-1';

  function createTasksRepo() {
    return { findById: jest.fn() };
  }

  function createTaskEventsRepo() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findAllForTask: jest.fn(),
      findLatest: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  function createUnitOfWork(
    tasks = createTasksRepo(),
    taskEvents = createTaskEventsRepo(),
  ) {
    return {
      tasks,
      taskEvents,
      unitOfWork: {
        transaction: jest.fn((work) => work({ tasks, taskEvents })),
      },
    };
  }

  it('creates a task event for an owned task', async () => {
    const { tasks, taskEvents, unitOfWork } = createUnitOfWork();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskEvents.create.mockResolvedValue({ id: eventId, taskId, userId });
    const uc = new CreateTaskEventUseCase(unitOfWork as any);
    const dueDate = new Date('2026-01-01T00:00:00Z');

    await expect(
      uc.execute({ taskId, userId, status: 'completed', dueDate }),
    ).resolves.toMatchObject({ id: eventId });

    expect(taskEvents.create).toHaveBeenCalledWith({
      taskId,
      userId,
      status: 'completed',
      dueDate,
    });
  });

  it('rejects invalid status when creating task event', async () => {
    const { unitOfWork } = createUnitOfWork();
    const uc = new CreateTaskEventUseCase(unitOfWork as any);

    await expect(
      uc.execute({ taskId, userId, status: 'bad' as any }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when creating event for missing task', async () => {
    const { tasks, unitOfWork } = createUnitOfWork();
    tasks.findById.mockResolvedValue(null);
    const uc = new CreateTaskEventUseCase(unitOfWork as any);

    await expect(
      uc.execute({ taskId, userId, status: 'pending' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('gets an event by id and task id', async () => {
    const taskEvents = createTaskEventsRepo();
    taskEvents.findById.mockResolvedValue({ id: eventId, taskId, userId });
    const uc = new GetTaskEventUseCase(taskEvents as any);

    await expect(uc.execute(eventId, userId, taskId)).resolves.toMatchObject({
      id: eventId,
    });
  });

  it('throws when event belongs to another task', async () => {
    const taskEvents = createTaskEventsRepo();
    taskEvents.findById.mockResolvedValue({
      id: eventId,
      taskId: 'another-task',
      userId,
    });
    const uc = new GetTaskEventUseCase(taskEvents as any);

    await expect(uc.execute(eventId, userId, taskId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists events for an owned task', async () => {
    const tasks = createTasksRepo();
    const taskEvents = createTaskEventsRepo();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskEvents.findAllForTask.mockResolvedValue([{ id: eventId }]);
    const uc = new ListTaskEventsUseCase(taskEvents as any, tasks as any);

    await expect(uc.execute(taskId, userId)).resolves.toEqual([
      { id: eventId },
    ]);
  });

  it('gets latest task event', async () => {
    const tasks = createTasksRepo();
    const taskEvents = createTaskEventsRepo();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskEvents.findLatest.mockResolvedValue({ id: eventId });
    const uc = new GetLatestTaskEventUseCase(taskEvents as any, tasks as any);

    await expect(uc.execute(taskId, userId)).resolves.toEqual({ id: eventId });
  });

  it('updates a task event', async () => {
    const tasks = createTasksRepo();
    const taskEvents = createTaskEventsRepo();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskEvents.update.mockResolvedValue({ id: eventId, status: 'completed' });
    const uc = new UpdateTaskEventUseCase(taskEvents as any, tasks as any);

    await expect(
      uc.execute(taskId, eventId, userId, { status: 'completed' }),
    ).resolves.toMatchObject({ id: eventId });
  });

  it('rejects empty task event update', async () => {
    const uc = new UpdateTaskEventUseCase({} as any, {} as any);

    await expect(
      uc.execute(taskId, eventId, userId, {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deletes a task event', async () => {
    const tasks = createTasksRepo();
    const taskEvents = createTaskEventsRepo();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskEvents.delete.mockResolvedValue(true);
    const uc = new DeleteTaskEventUseCase(taskEvents as any, tasks as any);

    await expect(uc.execute(taskId, eventId, userId)).resolves.toBeUndefined();
  });
});
