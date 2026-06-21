import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from '../../../../domain/task-event.entity';

@Entity('task_events')
export class TaskEventOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column() taskId!: string;
  @Index() @Column() userId!: string;
  @Column({ type: 'varchar', length: 32, default: 'pending' }) status!: TaskStatus;
  @Column({ type: 'timestamptz', nullable: true }) dueDate!: Date | null;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
