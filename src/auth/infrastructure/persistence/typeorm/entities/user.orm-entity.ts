import { TaskEventOrmEntity } from '@tasks/infrastructure/persistence/typeorm/entities/task-event.orm-entity';
import { TaskListTaskOrmEntity } from '@tasks/infrastructure/persistence/typeorm/entities/task-list-task.orm-entity';
import { TaskListOrmEntity } from '@tasks/infrastructure/persistence/typeorm/entities/task-list.orm-entity';
import { TaskOrmEntity } from '@tasks/infrastructure/persistence/typeorm/entities/task.orm-entity';
import { SubtaskOrmEntity } from '@tasks/infrastructure/persistence/typeorm/entities/subtask.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ length: 64 })
  username!: string;

  @Index({ unique: true })
  @Column({ length: 254 })
  email!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 32, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ default: false })
  emailVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => TaskOrmEntity, (task) => task.user)
  tasks!: TaskOrmEntity[];

  @OneToMany(() => TaskEventOrmEntity, (event) => event.user)
  taskEvents!: TaskEventOrmEntity[];

  @OneToMany(() => SubtaskOrmEntity, (subtask) => subtask.user)
  subtasks!: SubtaskOrmEntity[];

  @OneToMany(() => TaskListOrmEntity, (taskList) => taskList.user)
  taskLists!: TaskListOrmEntity[];

  @OneToMany(() => TaskListTaskOrmEntity, (taskListTask) => taskListTask.user)
  taskListLinks!: TaskListTaskOrmEntity[];
}
