import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskEventInput,
  TaskEventRepository,
  UpdateTaskEventInput,
} from '@tasks/domain/repositories/task-event.repository';
import { TaskEvent } from '@tasks/domain/task-event.entity';
import { TaskEventOrmEntity } from '../entities/task-event.orm-entity';

@Injectable()
export class TaskEventTypeOrmRepository implements TaskEventRepository {
  constructor(
    @InjectRepository(TaskEventOrmEntity)
    private readonly repo: Repository<TaskEventOrmEntity>,
  ) {}

  create(event: CreateTaskEventInput): Promise<TaskEvent> {
    return this.repo.save(this.repo.create(event));
  }

  findById(id: string, userId: string): Promise<TaskEvent | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  findAllForTask(taskId: string, userId: string): Promise<TaskEvent[]> {
    return this.repo.find({
      where: { taskId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  findLatest(taskId: string, userId: string): Promise<TaskEvent | null> {
    return this.repo.findOne({
      where: { taskId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    userId: string,
    taskId: string,
    updates: UpdateTaskEventInput,
  ): Promise<TaskEvent | null> {
    const existing = await this.repo.findOne({ where: { id, userId, taskId } });
    if (!existing) return null;

    await this.repo.save({
      ...existing,
      status: updates.status ?? existing.status,
      dueDate:
        updates.dueDate !== undefined ? updates.dueDate : existing.dueDate,
    });

    return this.repo.findOne({ where: { id, userId, taskId } });
  }

  async delete(id: string, userId: string, taskId: string): Promise<boolean> {
    const result = await this.repo.delete({ id, userId, taskId });
    return !!result.affected && result.affected > 0;
  }
}
