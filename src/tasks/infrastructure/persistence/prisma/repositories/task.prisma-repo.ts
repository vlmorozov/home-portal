import { Injectable } from '@nestjs/common';
import {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from '@tasks/domain/repositories/task.repository';
import { Task } from '@tasks/domain/task.entity';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type TaskRow = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type TaskPrismaClient = Pick<PrismaService, 'task'>;

@Injectable()
export class TaskPrismaRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: CreateTaskInput): Promise<Task> {
    const row = await this.prisma.task.create({
      data: {
        userId: task.userId,
        title: task.title,
        description: task.description ?? null,
      },
    });
    return this.toDomain(row);
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const row = await this.prisma.task.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllForUser(userId: string): Promise<Task[]> {
    const rows = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async update(
    id: string,
    userId: string,
    updates: UpdateTaskInput,
  ): Promise<Task | null> {
    const existing = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return null;

    const row = await this.prisma.task.update({
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
    const result = await this.prisma.task.deleteMany({ where: { id, userId } });
    return result.count > 0;
  }

  private toDomain(row: TaskRow): Task {
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
