import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskListInput,
  TaskListRepository,
  UpdateTaskListInput,
} from '@tasks/domain/repositories/task-list.repository';
import { TaskList } from '@tasks/domain/task-list.entity';
import { TaskListOrmEntity } from '../entities/task-list.orm-entity';

@Injectable()
export class TaskListTypeOrmRepository implements TaskListRepository {
  constructor(
    @InjectRepository(TaskListOrmEntity)
    private readonly repo: Repository<TaskListOrmEntity>,
  ) {}

  create(taskList: CreateTaskListInput): Promise<TaskList> {
    return this.repo.save(
      this.repo.create({
        userId: taskList.userId,
        title: taskList.title,
        description: taskList.description ?? null,
      }),
    );
  }

  findById(id: string, userId: string): Promise<TaskList | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  findAllForUser(userId: string): Promise<TaskList[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async update(
    id: string,
    userId: string,
    updates: UpdateTaskListInput,
  ): Promise<TaskList | null> {
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

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }
}
