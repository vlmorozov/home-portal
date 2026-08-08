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
import { SubtaskOrmEntity } from './subtask.orm-entity';
import { TaskEventOrmEntity } from './task-event.orm-entity';
import { TaskListTaskOrmEntity } from './task-list-task.orm-entity';

@Entity('tasks')
export class TaskOrmEntity {
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

  @OneToMany(() => TaskEventOrmEntity, (event) => event.task)
  events!: TaskEventOrmEntity[];

  @OneToMany(() => SubtaskOrmEntity, (subtask) => subtask.parentTask)
  subtasks!: SubtaskOrmEntity[];

  @OneToMany(() => SubtaskOrmEntity, (subtask) => subtask.task)
  parentLinks!: SubtaskOrmEntity[];

  @OneToMany(() => TaskListTaskOrmEntity, (taskListTask) => taskListTask.task)
  listLinks!: TaskListTaskOrmEntity[];
}
