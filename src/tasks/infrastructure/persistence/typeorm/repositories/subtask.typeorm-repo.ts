import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSubtaskInput,
  SubtaskRepository,
  UpdateSubtaskInput,
} from '@tasks/domain/repositories/subtask.repository';
import { Subtask } from '@tasks/domain/subtask.entity';
import { SubtaskOrmEntity } from '../entities/subtask.orm-entity';

@Injectable()
export class SubtaskTypeOrmRepository implements SubtaskRepository {
  constructor(
    @InjectRepository(SubtaskOrmEntity)
    private readonly repo: Repository<SubtaskOrmEntity>,
  ) {}

  create(subtask: CreateSubtaskInput): Promise<Subtask> {
    return this.repo.save(
      this.repo.create({
        taskId: subtask.taskId,
        parentTaskId: subtask.parentTaskId,
        userId: subtask.userId,
      }),
    );
  }

  findById(
    id: string,
    userId: string,
    parentTaskId: string,
  ): Promise<Subtask | null> {
    return this.repo.findOne({ where: { id, userId, parentTaskId } });
  }

  findAllForTask(parentTaskId: string, userId: string): Promise<Subtask[]> {
    return this.repo.find({
      where: { parentTaskId, userId },
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    id: string,
    userId: string,
    parentTaskId: string,
    updates: UpdateSubtaskInput,
  ): Promise<Subtask | null> {
    const existing = await this.repo.findOne({
      where: { id, userId, parentTaskId },
    });
    if (!existing) return null;

    await this.repo.save({
      ...existing,
      taskId: updates.taskId ?? existing.taskId,
    });

    return this.repo.findOne({ where: { id, userId, parentTaskId } });
  }

  async delete(
    id: string,
    userId: string,
    parentTaskId: string,
  ): Promise<boolean> {
    const result = await this.repo.delete({ id, userId, parentTaskId });
    return !!result.affected && result.affected > 0;
  }
}
