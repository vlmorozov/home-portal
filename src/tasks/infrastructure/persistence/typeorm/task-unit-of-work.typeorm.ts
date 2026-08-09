import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskUnitOfWork } from '@tasks/domain/repositories/task-unit-of-work';
import { TaskEventOrmEntity } from './entities/task-event.orm-entity';
import { TaskOrmEntity } from './entities/task.orm-entity';
import { TaskEventTypeOrmRepository } from './repositories/task-event.typeorm-repo';
import { TaskTypeOrmRepository } from './repositories/task.typeorm-repo';

@Injectable()
export class TaskTypeOrmUnitOfWork implements TaskUnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  transaction<T>(
    work: Parameters<TaskUnitOfWork['transaction']>[0],
  ): Promise<T> {
    return this.dataSource.transaction((manager) => {
      const tasks = new TaskTypeOrmRepository(
        manager.getRepository(TaskOrmEntity),
      );
      const taskEvents = new TaskEventTypeOrmRepository(
        manager.getRepository(TaskEventOrmEntity),
      );

      return work({ tasks, taskEvents }) as Promise<T>;
    });
  }
}
