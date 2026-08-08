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
import { TaskOrmEntity } from './task.orm-entity';

@Entity('subtasks')
export class SubtaskOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  taskId!: string;

  @Index()
  @Column()
  parentTaskId!: string;

  @Index()
  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TaskOrmEntity, (task) => task.parentLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task!: TaskOrmEntity;

  @ManyToOne(() => TaskOrmEntity, (task) => task.subtasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask!: TaskOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;
}
