import { Injectable } from '@nestjs/common';
import {
  CreateSubtaskInput,
  SubtaskRepository,
  UpdateSubtaskInput,
} from '@tasks/domain/repositories/subtask.repository';
import { Subtask } from '@tasks/domain/subtask.entity';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

type SubtaskRow = {
  id: string;
  userId: string;
  parentTaskId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
};

type SubtaskPrismaClient = Pick<PrismaService, 'subtask'>;

@Injectable()
export class SubtaskPrismaRepository implements SubtaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(subtask: CreateSubtaskInput): Promise<Subtask> {
    const row = await this.prisma.subtask.create({ data: subtask });
    return this.toDomain(row);
  }

  async findById(
    id: string,
    userId: string,
    parentTaskId: string,
  ): Promise<Subtask | null> {
    const row = await this.prisma.subtask.findFirst({
      where: { id, userId, parentTaskId },
    });
    return row ? this.toDomain(row) : null;
  }

  async findAllForTask(parentTaskId: string, userId: string): Promise<Subtask[]> {
    const rows = await this.prisma.subtask.findMany({
      where: { parentTaskId, userId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async update(
    id: string,
    userId: string,
    parentTaskId: string,
    updates: UpdateSubtaskInput,
  ): Promise<Subtask | null> {
    const existing = await this.prisma.subtask.findFirst({
      where: { id, userId, parentTaskId },
    });
    if (!existing) return null;

    const row = await this.prisma.subtask.update({
      where: { id },
      data: { taskId: updates.taskId ?? undefined },
    });
    return this.toDomain(row);
  }

  async delete(
    id: string,
    userId: string,
    parentTaskId: string,
  ): Promise<boolean> {
    const result = await this.prisma.subtask.deleteMany({
      where: { id, userId, parentTaskId },
    });
    return result.count > 0;
  }

  private toDomain(row: SubtaskRow): Subtask {
    return new Subtask(
      row.id,
      row.userId,
      row.parentTaskId,
      row.taskId,
      row.createdAt,
      row.updatedAt,
    );
  }
}
