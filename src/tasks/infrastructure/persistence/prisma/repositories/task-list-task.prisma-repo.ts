import { Injectable } from '@nestjs/common';
import {
  CreateTaskListTaskInput,
  TaskListTaskRepository,
} from '@tasks/domain/repositories/task-list-task.repository';
import { TaskListTask } from '@tasks/domain/task-list-task.entity';
import { Task } from '@tasks/domain/task.entity';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type TaskListTaskRow = {
  id: string;
  taskListId: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskRow = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type TaskListTaskPrismaClient = Pick<PrismaService, 'taskListTask'>;

@Injectable()
export class TaskListTaskPrismaRepository implements TaskListTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTaskListTaskInput): Promise<TaskListTask> {
    const row = await this.prisma.taskListTask.create({ data: input });
    return this.toDomain(row);
  }

  async findById(id: string, userId: string): Promise<TaskListTask | null> {
    const row = await this.prisma.taskListTask.findFirst({
      where: { id, userId },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByTask(
    taskListId: string,
    taskId: string,
    userId: string,
  ): Promise<TaskListTask | null> {
    const row = await this.prisma.taskListTask.findFirst({
      where: { taskListId, taskId, userId },
    });
    return row ? this.toDomain(row) : null;
  }

  async findTasksForList(taskListId: string, userId: string): Promise<Task[]> {
    const rows = await this.prisma.taskListTask.findMany({
      where: { taskListId, userId },
      include: { task: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.taskToDomain(row.task));
  }

  async deleteByTask(
    taskListId: string,
    taskId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.prisma.taskListTask.deleteMany({
      where: { taskListId, taskId, userId },
    });
    return result.count > 0;
  }

  private toDomain(row: TaskListTaskRow): TaskListTask {
    return new TaskListTask(
      row.id,
      row.taskListId,
      row.taskId,
      row.userId,
      row.createdAt,
      row.updatedAt,
    );
  }

  private taskToDomain(row: TaskRow): Task {
    return new Task(
      row.id,
      row.userId,
      row.title,
      row.description,
      row.createdAt,
      row.updatedAt,
    );
  }
}
