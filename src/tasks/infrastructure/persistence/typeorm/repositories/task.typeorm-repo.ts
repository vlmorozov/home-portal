import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../../../../domain/repositories/task.repository';
import { Task } from '../../../../domain/task.entity';
import { TaskOrmEntity } from '../entities/task.orm-entity';

@Injectable()
export class TaskTypeOrmRepository implements TaskRepository {
  constructor(@InjectRepository(TaskOrmEntity) private readonly repo: Repository<TaskOrmEntity>) {}

  async create(task: Partial<Task>): Promise<Task> {
    const entity = this.repo.create({ status: 'pending', ...task });
    return this.repo.save(entity);
  }

  findById(id: string, userId: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  findAllForUser(userId: string): Promise<Task[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async update(id: string, userId: string, updates: Partial<Task>): Promise<Task | null> {
    const existing = await this.repo.findOne({ where: { id, userId } });
    if (!existing) return null;
    await this.repo.save({ ...existing, ...updates });
    return this.repo.findOne({ where: { id, userId } });
  }

  async delete(id: string, userId: string) {
    const result = await this.repo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }
}
