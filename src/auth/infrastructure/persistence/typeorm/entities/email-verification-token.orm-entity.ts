import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_verification_tokens')
export class EmailVerificationTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column({ unique: true }) token!: string;
  @Column() expiresAt!: Date;
  @CreateDateColumn() createdAt!: Date;
}
