import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1700000000000 implements MigrationInterface {
  name = 'CreateUsers1700000000000'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await q.query(`CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "username" varchar(64) NOT NULL UNIQUE,
      "email" varchar(254) NOT NULL UNIQUE,
      "phone" varchar NULL UNIQUE,
      "passwordHash" varchar NULL,
      "emailVerified" boolean NOT NULL DEFAULT false,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
  }
  public async down(q: QueryRunner): Promise<void> { await q.query('DROP TABLE IF EXISTS "users"'); }
}
