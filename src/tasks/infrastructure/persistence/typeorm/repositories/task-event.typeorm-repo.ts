import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskEventInput,
  TaskEventRepository,
} from '../../../../domain/repositories/task-event.repository';
import { TaskEvent } from '../../../../domain/task-event.entity';
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
}
