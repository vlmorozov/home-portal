import { Injectable } from '@nestjs/common';
import {
  CreateTaskEventInput,
  TaskEventRepository,
  UpdateTaskEventInput,
} from '@tasks/domain/repositories/task-event.repository';
import { TaskEvent, TaskStatus } from '@tasks/domain/task-event.entity';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type TaskEventRow = {
  id: string;
  taskId: string;
  userId: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type TaskEventPrismaClient = Pick<PrismaService, 'taskEvent'>;

@Injectable()
export class TaskEventPrismaRepository implements TaskEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: CreateTaskEventInput): Promise<TaskEvent> {
    const row = await this.prisma.taskEvent.create({ data: event });
    return this.toDomain(row);
  }

  async findById(id: string, userId: string): Promise<TaskEvent | null> {
    const row = await this.prisma.taskEvent.findFirst({
      where: { id, userId },
    });
    return row ? this.toDomain(row) : null;
  }

  async findAllForTask(taskId: string, userId: string): Promise<TaskEvent[]> {
    const rows = await this.prisma.taskEvent.findMany({
      where: { taskId, userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findLatest(taskId: string, userId: string): Promise<TaskEvent | null> {
    const row = await this.prisma.taskEvent.findFirst({
      where: { taskId, userId },
      orderBy: { createdAt: 'desc' },
    });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    userId: string,
    taskId: string,
    updates: UpdateTaskEventInput,
  ): Promise<TaskEvent | null> {
    const existing = await this.prisma.taskEvent.findFirst({
      where: { id, userId, taskId },
    });
    if (!existing) return null;

    const row = await this.prisma.taskEvent.update({
      where: { id },
      data: {
        status: updates.status ?? undefined,
        dueDate: updates.dueDate !== undefined ? updates.dueDate : undefined,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string, taskId: string): Promise<boolean> {
    const result = await this.prisma.taskEvent.deleteMany({
      where: { id, userId, taskId },
    });
    return result.count > 0;
  }

  private toDomain(row: TaskEventRow): TaskEvent {
    return new TaskEvent(
      row.id,
      row.taskId,
      row.userId,
      row.status as TaskStatus,
      row.dueDate,
      row.createdAt,
      row.updatedAt,
    );
  }
}
