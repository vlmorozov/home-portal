import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskListTaskInput,
  TaskListTaskRepository,
} from '@tasks/domain/repositories/task-list-task.repository';
import { TaskListTask } from '@tasks/domain/task-list-task.entity';
import { Task } from '@tasks/domain/task.entity';
import { TaskListTaskOrmEntity } from '../entities/task-list-task.orm-entity';
import { TaskOrmEntity } from '../entities/task.orm-entity';

@Injectable()
export class TaskListTaskTypeOrmRepository implements TaskListTaskRepository {
  constructor(
    @InjectRepository(TaskListTaskOrmEntity)
    private readonly repo: Repository<TaskListTaskOrmEntity>,
  ) {}

  create(input: CreateTaskListTaskInput): Promise<TaskListTask> {
    return this.repo.save(this.repo.create(input));
  }

  findById(id: string, userId: string): Promise<TaskListTask | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  findByTask(
    taskListId: string,
    taskId: string,
    userId: string,
  ): Promise<TaskListTask | null> {
    return this.repo.findOne({ where: { taskListId, taskId, userId } });
  }

  findTasksForList(taskListId: string, userId: string): Promise<Task[]> {
    return this.repo
      .createQueryBuilder('taskListTask')
      .innerJoin(
        TaskOrmEntity,
        'task',
        'task.id = taskListTask.taskId AND task.userId = taskListTask.userId',
      )
      .select([
        'task.id AS "id"',
        'task.userId AS "userId"',
        'task.title AS "title"',
        'task.description AS "description"',
        'task.createdAt AS "createdAt"',
        'task.updatedAt AS "updatedAt"',
      ])
      .where('taskListTask.taskListId = :taskListId', { taskListId })
      .andWhere('taskListTask.userId = :userId', { userId })
      .orderBy('taskListTask.createdAt', 'DESC')
      .getRawMany<Task>();
  }

  async deleteByTask(
    taskListId: string,
    taskId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.repo.delete({ taskListId, taskId, userId });
    return !!result.affected && result.affected > 0;
  }
}
