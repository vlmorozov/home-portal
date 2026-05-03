import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreatePasswordResetTokens1700000000005 implements MigrationInterface {
  name = 'CreatePasswordResetTokens1700000000005'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "token" varchar NOT NULL UNIQUE,
      "channel" varchar NOT NULL,
      "expiresAt" timestamptz NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )`);
  }
  public async down(q: QueryRunner): Promise<void> { await q.query('DROP TABLE IF EXISTS "password_reset_tokens"'); }
}
