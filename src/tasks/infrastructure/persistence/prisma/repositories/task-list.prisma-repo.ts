import { Injectable } from '@nestjs/common';
import {
  CreateTaskListInput,
  TaskListRepository,
  UpdateTaskListInput,
} from '@tasks/domain/repositories/task-list.repository';
import { TaskList } from '@tasks/domain/task-list.entity';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type TaskListRow = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type TaskListPrismaClient = Pick<PrismaService, 'taskList'>;

@Injectable()
export class TaskListPrismaRepository implements TaskListRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskList: CreateTaskListInput): Promise<TaskList> {
    const row = await this.prisma.taskList.create({
      data: {
        userId: taskList.userId,
        title: taskList.title,
        description: taskList.description ?? null,
      },
    });
    return this.toDomain(row);
  }

  async findById(id: string, userId: string): Promise<TaskList | null> {
    const row = await this.prisma.taskList.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllForUser(userId: string): Promise<TaskList[]> {
    const rows = await this.prisma.taskList.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async update(
    id: string,
    userId: string,
    updates: UpdateTaskListInput,
  ): Promise<TaskList | null> {
    const existing = await this.prisma.taskList.findFirst({
      where: { id, userId },
    });
    if (!existing) return null;

    const row = await this.prisma.taskList.update({
      where: { id },
      data: {
        title: updates.title ?? undefined,
        description:
          updates.description !== undefined ? updates.description : undefined,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.taskList.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  private toDomain(row: TaskListRow): TaskList {
    return new TaskList(
      row.id,
      row.userId,
      row.title,
      row.description,
      row.createdAt,
      row.updatedAt,
    );
  }
}
