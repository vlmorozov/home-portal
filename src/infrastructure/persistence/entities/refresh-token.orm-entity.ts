import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column({ unique: true }) token!: string;
  @Column() expiresAt!: Date;
  @CreateDateColumn() createdAt!: Date;
  @Column({ type: 'timestamptz', nullable: true }) revokedAt!: Date | null;
}
