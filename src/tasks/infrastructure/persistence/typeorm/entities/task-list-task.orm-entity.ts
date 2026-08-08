import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../../../auth/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { TaskListOrmEntity } from './task-list.orm-entity';
import { TaskOrmEntity } from './task.orm-entity';

@Entity('task_list_tasks')
@Index(['userId', 'taskListId', 'taskId'], { unique: true })
export class TaskListTaskOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  taskListId!: string;

  @Index()
  @Column()
  taskId!: string;

  @Index()
  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TaskListOrmEntity, (taskList) => taskList.taskLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskListId' })
  taskList!: TaskListOrmEntity;

  @ManyToOne(() => TaskOrmEntity, (task) => task.listLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task!: TaskOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;
}
