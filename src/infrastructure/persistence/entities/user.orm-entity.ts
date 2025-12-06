import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index({ unique: true }) @Column({ length: 64 }) username!: string;
  @Index({ unique: true }) @Column({ length: 254 }) email!: string;
  @Index({ unique: true }) @Column({ type: 'varchar', length: 32, nullable: true }) phone!: string | null;
  @Column({ type: 'varchar', nullable: true }) passwordHash!: string | null;
  @Column({ default: false }) emailVerified!: boolean;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
