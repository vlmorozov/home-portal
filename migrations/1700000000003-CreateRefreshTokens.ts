import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateRefreshTokens1700000000003 implements MigrationInterface {
  name = 'CreateRefreshTokens1700000000003'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "refresh_tokens" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "token" varchar NOT NULL UNIQUE,
      "expiresAt" timestamptz NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "revokedAt" timestamptz NULL
    )`);
  }
  public async down(q: QueryRunner): Promise<void> { await q.query('DROP TABLE IF EXISTS "refresh_tokens"'); }
}
