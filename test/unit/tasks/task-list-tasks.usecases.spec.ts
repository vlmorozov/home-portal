import { NotFoundException } from '@nestjs/common';
import { AddTaskToTaskListUseCase } from '@tasks/application/handlers/task-lists/add-task-to-task-list.usecase';
import { ListTaskListTasksUseCase } from '@tasks/application/handlers/task-lists/list-task-list-tasks.usecase';
import { RemoveTaskFromTaskListUseCase } from '@tasks/application/handlers/task-lists/remove-task-from-task-list.usecase';

describe('TaskListTask use cases', () => {
  const userId = 'user-1';
  const taskListId = 'list-1';
  const taskId = 'task-1';

  function createTaskListTasksRepo() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findByTask: jest.fn(),
      findTasksForList: jest.fn(),
      deleteByTask: jest.fn(),
    };
  }

  function createTaskListsRepo() {
    return {
      findById: jest.fn(),
    };
  }

  function createTasksRepo() {
    return {
      findById: jest.fn(),
    };
  }

  it('adds a task to a task list', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    const tasks = createTasksRepo();
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskListTasks.findByTask.mockResolvedValue(null);
    taskListTasks.create.mockResolvedValue({
      id: 'link-1',
      taskListId,
      taskId,
    });
    const uc = new AddTaskToTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
      tasks as any,
    );

    await expect(uc.execute({ taskListId, taskId, userId })).resolves.toEqual({
      id: 'link-1',
      taskListId,
      taskId,
    });

    expect(taskListTasks.create).toHaveBeenCalledWith({
      taskListId,
      taskId,
      userId,
    });
  });

  it('returns existing link when task is already in list', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    const tasks = createTasksRepo();
    const existing = { id: 'link-1', taskListId, taskId };
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    tasks.findById.mockResolvedValue({ id: taskId, userId });
    taskListTasks.findByTask.mockResolvedValue(existing);
    const uc = new AddTaskToTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
      tasks as any,
    );

    await expect(uc.execute({ taskListId, taskId, userId })).resolves.toBe(
      existing,
    );
    expect(taskListTasks.create).not.toHaveBeenCalled();
  });

  it('does not add task when task list is missing or belongs to another user', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    const tasks = createTasksRepo();
    taskLists.findById.mockResolvedValue(null);
    const uc = new AddTaskToTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
      tasks as any,
    );

    await expect(
      uc.execute({ taskListId, taskId, userId }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tasks.findById).not.toHaveBeenCalled();
    expect(taskListTasks.create).not.toHaveBeenCalled();
  });

  it('does not add missing or foreign task to list', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    const tasks = createTasksRepo();
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    tasks.findById.mockResolvedValue(null);
    const uc = new AddTaskToTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
      tasks as any,
    );

    await expect(
      uc.execute({ taskListId, taskId, userId }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(taskListTasks.create).not.toHaveBeenCalled();
  });

  it('lists tasks from a task list', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    taskListTasks.findTasksForList.mockResolvedValue([{ id: taskId }]);
    const uc = new ListTaskListTasksUseCase(
      taskListTasks as any,
      taskLists as any,
    );

    await expect(uc.execute(taskListId, userId)).resolves.toEqual([
      { id: taskId },
    ]);
    expect(taskListTasks.findTasksForList).toHaveBeenCalledWith(
      taskListId,
      userId,
    );
  });

  it('removes task from task list without deleting the task', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    taskListTasks.deleteByTask.mockResolvedValue(true);
    const uc = new RemoveTaskFromTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
    );

    await expect(
      uc.execute(taskListId, taskId, userId),
    ).resolves.toBeUndefined();
    expect(taskListTasks.deleteByTask).toHaveBeenCalledWith(
      taskListId,
      taskId,
      userId,
    );
  });

  it('throws when removing a missing task-list link', async () => {
    const taskListTasks = createTaskListTasksRepo();
    const taskLists = createTaskListsRepo();
    taskLists.findById.mockResolvedValue({ id: taskListId, userId });
    taskListTasks.deleteByTask.mockResolvedValue(false);
    const uc = new RemoveTaskFromTaskListUseCase(
      taskListTasks as any,
      taskLists as any,
    );

    await expect(uc.execute(taskListId, taskId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
