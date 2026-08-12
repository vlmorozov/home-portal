import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskUnitOfWork } from '@tasks/domain/repositories/task-unit-of-work';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { TaskEventPrismaRepository } from './repositories/task-event.prisma-repo';
import { TaskPrismaRepository } from './repositories/task.prisma-repo';

@Injectable()
export class TaskPrismaUnitOfWork implements TaskUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(
    work: (repos: {
      tasks: TaskPrismaRepository;
      taskEvents: TaskEventPrismaRepository;
    }) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx: Prisma.TransactionClient) =>
      work({
        tasks: new TaskPrismaRepository(tx as unknown as PrismaService),
        taskEvents: new TaskEventPrismaRepository(
          tx as unknown as PrismaService,
        ),
      }),
    );
  }
}
