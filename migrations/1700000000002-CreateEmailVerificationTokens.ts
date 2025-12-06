import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateEmailVerificationTokens1700000000002 implements MigrationInterface {
  name = 'CreateEmailVerificationTokens1700000000002'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "token" varchar NOT NULL UNIQUE,
      "expiresAt" timestamptz NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )`);
  }
  public async down(q: QueryRunner): Promise<void> { await q.query('DROP TABLE IF EXISTS "email_verification_tokens"'); }
}
