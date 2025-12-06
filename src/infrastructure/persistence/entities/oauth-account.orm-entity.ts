import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oauth_accounts')
export class OAuthAccountOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() provider!: string;
  @Column() providerId!: string;
  @Column() userId!: string;
  @CreateDateColumn() createdAt!: Date;
}
