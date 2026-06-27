import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTaskListUseCase } from '../../../src/tasks/application/handlers/task-lists/create-task-list.usecase';
import { DeleteTaskListUseCase } from '../../../src/tasks/application/handlers/task-lists/delete-task-list.usecase';
import { GetTaskListUseCase } from '../../../src/tasks/application/handlers/task-lists/get-task-list.usecase';
import { ListTaskListsUseCase } from '../../../src/tasks/application/handlers/task-lists/list-task-lists.usecase';
import { UpdateTaskListUseCase } from '../../../src/tasks/application/handlers/task-lists/update-task-list.usecase';

describe('TaskList use cases', () => {
  const userId = 'user-1';

  function createTaskListsRepo() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findAllForUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  it('creates a task list with normalized title', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.create.mockResolvedValue({
      id: 'list-1',
      userId,
      title: 'Home',
      description: null,
    });
    const uc = new CreateTaskListUseCase(taskLists as any);

    await expect(
      uc.execute({ userId, title: '  Home  ', description: null }),
    ).resolves.toMatchObject({ id: 'list-1' });

    expect(taskLists.create).toHaveBeenCalledWith({
      userId,
      title: 'Home',
      description: null,
    });
  });

  it('rejects an empty task list title', async () => {
    const uc = new CreateTaskListUseCase(createTaskListsRepo() as any);

    await expect(
      uc.execute({ userId, title: '   ', description: null }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists task lists for user', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.findAllForUser.mockResolvedValue([{ id: 'list-1', userId }]);
    const uc = new ListTaskListsUseCase(taskLists as any);

    await expect(uc.execute(userId)).resolves.toEqual([
      { id: 'list-1', userId },
    ]);
    expect(taskLists.findAllForUser).toHaveBeenCalledWith(userId);
  });

  it('gets a task list by id and user', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.findById.mockResolvedValue({ id: 'list-1', userId });
    const uc = new GetTaskListUseCase(taskLists as any);

    await expect(uc.execute('list-1', userId)).resolves.toMatchObject({
      id: 'list-1',
    });
  });

  it('throws when task list is not found', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.findById.mockResolvedValue(null);
    const uc = new GetTaskListUseCase(taskLists as any);

    await expect(uc.execute('missing', userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a task list with normalized title', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.update.mockResolvedValue({ id: 'list-1', title: 'Updated' });
    const uc = new UpdateTaskListUseCase(taskLists as any);

    await expect(
      uc.execute('list-1', userId, {
        title: '  Updated  ',
        description: 'Description',
      }),
    ).resolves.toMatchObject({ id: 'list-1' });

    expect(taskLists.update).toHaveBeenCalledWith('list-1', userId, {
      title: 'Updated',
      description: 'Description',
    });
  });

  it('throws when updating missing task list', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.update.mockResolvedValue(null);
    const uc = new UpdateTaskListUseCase(taskLists as any);

    await expect(
      uc.execute('missing', userId, { title: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a task list', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.delete.mockResolvedValue(true);
    const uc = new DeleteTaskListUseCase(taskLists as any);

    await expect(uc.execute('list-1', userId)).resolves.toBeUndefined();
    expect(taskLists.delete).toHaveBeenCalledWith('list-1', userId);
  });

  it('throws when deleting missing task list', async () => {
    const taskLists = createTaskListsRepo();
    taskLists.delete.mockResolvedValue(false);
    const uc = new DeleteTaskListUseCase(taskLists as any);

    await expect(uc.execute('missing', userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
