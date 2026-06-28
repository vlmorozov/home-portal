import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTaskUseCase } from '../../../src/tasks/application/handlers/tasks/create-task.usecase';
import { DeleteTaskUseCase } from '../../../src/tasks/application/handlers/tasks/delete-task.usecase';
import { GetTaskUseCase } from '../../../src/tasks/application/handlers/tasks/get-task.usecase';
import { ListTasksUseCase } from '../../../src/tasks/application/handlers/tasks/list-tasks.usecase';
import { UpdateTaskUseCase } from '../../../src/tasks/application/handlers/tasks/update-task.usecase';

describe('Task use cases', () => {
  const userId = 'user-1';
  const taskId = 'task-1';

  function createTasksRepo() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findAllForUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  function createUnitOfWork(tasks = createTasksRepo()) {
    return {
      tasks,
      unitOfWork: {
        transaction: jest.fn((work) => work({ tasks })),
      },
    };
  }

  it('creates a task with normalized title', async () => {
    const { tasks, unitOfWork } = createUnitOfWork();
    tasks.create.mockResolvedValue({ id: taskId, userId, title: 'Buy milk' });
    const uc = new CreateTaskUseCase(unitOfWork as any);

    await expect(
      uc.execute({ userId, title: '  Buy milk  ', description: null }),
    ).resolves.toMatchObject({ id: taskId });

    expect(tasks.create).toHaveBeenCalledWith({
      userId,
      title: 'Buy milk',
      description: null,
    });
  });

  it('rejects an empty task title', async () => {
    const { unitOfWork } = createUnitOfWork();
    const uc = new CreateTaskUseCase(unitOfWork as any);

    await expect(
      uc.execute({ userId, title: '   ', description: null }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists tasks for user', async () => {
    const tasks = createTasksRepo();
    tasks.findAllForUser.mockResolvedValue([{ id: taskId, userId }]);
    const uc = new ListTasksUseCase(tasks as any);

    await expect(uc.execute(userId)).resolves.toEqual([{ id: taskId, userId }]);
    expect(tasks.findAllForUser).toHaveBeenCalledWith(userId);
  });

  it('gets a task by id and user', async () => {
    const tasks = createTasksRepo();
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    const uc = new GetTaskUseCase(tasks as any);

    await expect(uc.execute(taskId, userId)).resolves.toMatchObject({
      id: taskId,
    });
  });

  it('throws when task is not found', async () => {
    const tasks = createTasksRepo();
    tasks.findById.mockResolvedValue(null);
    const uc = new GetTaskUseCase(tasks as any);

    await expect(uc.execute(taskId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a task with normalized title', async () => {
    const { tasks, unitOfWork } = createUnitOfWork();
    tasks.update.mockResolvedValue({ id: taskId, userId, title: 'Updated' });
    const uc = new UpdateTaskUseCase(unitOfWork as any);

    await expect(
      uc.execute(taskId, userId, {
        title: '  Updated  ',
        description: 'Description',
      }),
    ).resolves.toMatchObject({ id: taskId });

    expect(tasks.update).toHaveBeenCalledWith(taskId, userId, {
      title: 'Updated',
      description: 'Description',
    });
  });

  it('throws when updating missing task', async () => {
    const { tasks, unitOfWork } = createUnitOfWork();
    tasks.update.mockResolvedValue(null);
    const uc = new UpdateTaskUseCase(unitOfWork as any);

    await expect(
      uc.execute(taskId, userId, { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a task', async () => {
    const tasks = createTasksRepo();
    tasks.delete.mockResolvedValue(true);
    const uc = new DeleteTaskUseCase(tasks as any);

    await expect(uc.execute(taskId, userId)).resolves.toBeUndefined();
  });

  it('throws when deleting missing task', async () => {
    const tasks = createTasksRepo();
    tasks.delete.mockResolvedValue(false);
    const uc = new DeleteTaskUseCase(tasks as any);

    await expect(uc.execute(taskId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
