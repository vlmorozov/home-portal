import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('password_reset_tokens')
export class PasswordResetTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column({ unique: true }) token!: string;
  @Column({ type: 'varchar', length: 16 }) channel!: string;
  @Column() expiresAt!: Date;
  @CreateDateColumn() createdAt!: Date;
}
