import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from '../../../../domain/repositories/task.repository';
import { Task } from '../../../../domain/task.entity';
import { TaskOrmEntity } from '../entities/task.orm-entity';

@Injectable()
export class TaskTypeOrmRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repo: Repository<TaskOrmEntity>,
  ) {}

  async create(task: CreateTaskInput): Promise<Task> {
    return this.repo.save(
      this.repo.create({
        userId: task.userId,
        title: task.title,
        description: task.description ?? null,
      }),
    );
  }

  findById(id: string, userId: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  findAllForUser(userId: string): Promise<Task[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async update(
    id: string,
    userId: string,
    updates: UpdateTaskInput,
  ): Promise<Task | null> {
    const existing = await this.repo.findOne({ where: { id, userId } });
    if (!existing) return null;

    if (updates.title !== undefined || updates.description !== undefined) {
      await this.repo.save({
        ...existing,
        title: updates.title ?? existing.title,
        description:
          updates.description !== undefined
            ? updates.description
            : existing.description,
      });
    }

    return this.repo.findOne({ where: { id, userId } });
  }

  async delete(id: string, userId: string) {
    const result = await this.repo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }
}
