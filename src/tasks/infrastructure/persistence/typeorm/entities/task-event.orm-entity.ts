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
import { TaskStatus } from '../../../../domain/task-event.entity';
import { TaskOrmEntity } from './task.orm-entity';

@Entity('task_events')
export class TaskEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  taskId!: string;

  @Index()
  @Column()
  userId!: string;

  @Column({ type: 'varchar', length: 32, default: 'pending' })
  status!: TaskStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TaskOrmEntity, (task) => task.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task!: TaskOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;
}
