import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../../../auth/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { TaskListTaskOrmEntity } from './task-list-task.orm-entity';

@Entity('task_lists')
export class TaskListOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  userId!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @OneToMany(() => TaskListTaskOrmEntity, (taskListTask) => taskListTask.taskList)
  taskLinks!: TaskListTaskOrmEntity[];
}
