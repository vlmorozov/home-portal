import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSubtaskUseCase } from '../../../src/tasks/application/handlers/subtasks/create-subtask.usecase';
import { DeleteSubtaskUseCase } from '../../../src/tasks/application/handlers/subtasks/delete-subtask.usecase';
import { GetSubtaskUseCase } from '../../../src/tasks/application/handlers/subtasks/get-subtask.usecase';
import { ListSubtasksUseCase } from '../../../src/tasks/application/handlers/subtasks/list-subtasks.usecase';
import { UpdateSubtaskUseCase } from '../../../src/tasks/application/handlers/subtasks/update-subtask.usecase';

describe('Subtask use cases', () => {
  const userId = 'user-1';
  const parentTaskId = 'parent-task';
  const childTaskId = 'child-task';
  const subtaskId = 'subtask-1';

  function createTasksRepo() {
    return { findById: jest.fn() };
  }

  function createSubtasksRepo() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findAllForTask: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  it('creates a subtask link between owned tasks', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById
      .mockResolvedValueOnce({ id: parentTaskId, userId })
      .mockResolvedValueOnce({ id: childTaskId, userId });
    subtasks.create.mockResolvedValue({ id: subtaskId });
    const uc = new CreateSubtaskUseCase(subtasks as any, tasks as any);

    await expect(
      uc.execute({ parentTaskId, taskId: childTaskId, userId }),
    ).resolves.toEqual({ id: subtaskId });

    expect(subtasks.create).toHaveBeenCalledWith({
      parentTaskId,
      taskId: childTaskId,
      userId,
    });
  });

  it('rejects self-reference subtask', async () => {
    const uc = new CreateSubtaskUseCase({} as any, {} as any);

    await expect(
      uc.execute({ parentTaskId, taskId: parentTaskId, userId }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when parent task is missing', async () => {
    const tasks = createTasksRepo();
    tasks.findById.mockResolvedValue(null);
    const uc = new CreateSubtaskUseCase(
      createSubtasksRepo() as any,
      tasks as any,
    );

    await expect(
      uc.execute({ parentTaskId, taskId: childTaskId, userId }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when child task is missing', async () => {
    const tasks = createTasksRepo();
    tasks.findById
      .mockResolvedValueOnce({ id: parentTaskId, userId })
      .mockResolvedValueOnce(null);
    const uc = new CreateSubtaskUseCase(
      createSubtasksRepo() as any,
      tasks as any,
    );

    await expect(
      uc.execute({ parentTaskId, taskId: childTaskId, userId }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists subtasks for an owned task', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById.mockResolvedValue({ id: parentTaskId, userId });
    subtasks.findAllForTask.mockResolvedValue([{ id: subtaskId }]);
    const uc = new ListSubtasksUseCase(subtasks as any, tasks as any);

    await expect(uc.execute(parentTaskId, userId)).resolves.toEqual([
      { id: subtaskId },
    ]);
  });

  it('gets a subtask by id', async () => {
    const subtasks = createSubtasksRepo();
    subtasks.findById.mockResolvedValue({ id: subtaskId });
    const uc = new GetSubtaskUseCase(subtasks as any);

    await expect(uc.execute(parentTaskId, subtaskId, userId)).resolves.toEqual({
      id: subtaskId,
    });
  });

  it('updates subtask child task', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById
      .mockResolvedValueOnce({ id: parentTaskId, userId })
      .mockResolvedValueOnce({ id: childTaskId, userId });
    subtasks.update.mockResolvedValue({ id: subtaskId, taskId: childTaskId });
    const uc = new UpdateSubtaskUseCase(subtasks as any, tasks as any);

    await expect(
      uc.execute(parentTaskId, subtaskId, userId, { taskId: childTaskId }),
    ).resolves.toMatchObject({ id: subtaskId });
  });

  it('rejects empty subtask update', async () => {
    const uc = new UpdateSubtaskUseCase({} as any, {} as any);

    await expect(
      uc.execute(parentTaskId, subtaskId, userId, {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when updated subtask link is missing', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById
      .mockResolvedValueOnce({ id: parentTaskId, userId })
      .mockResolvedValueOnce({ id: childTaskId, userId });
    subtasks.update.mockResolvedValue(null);
    const uc = new UpdateSubtaskUseCase(subtasks as any, tasks as any);

    await expect(
      uc.execute(parentTaskId, subtaskId, userId, { taskId: childTaskId }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a subtask link', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById.mockResolvedValue({ id: parentTaskId, userId });
    subtasks.delete.mockResolvedValue(true);
    const uc = new DeleteSubtaskUseCase(subtasks as any, tasks as any);

    await expect(
      uc.execute(parentTaskId, subtaskId, userId),
    ).resolves.toBeUndefined();
  });

  it('throws when deleting missing subtask link', async () => {
    const tasks = createTasksRepo();
    const subtasks = createSubtasksRepo();
    tasks.findById.mockResolvedValue({ id: parentTaskId, userId });
    subtasks.delete.mockResolvedValue(false);
    const uc = new DeleteSubtaskUseCase(subtasks as any, tasks as any);

    await expect(
      uc.execute(parentTaskId, subtaskId, userId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
