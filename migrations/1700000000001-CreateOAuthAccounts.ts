import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateOAuthAccounts1700000000001 implements MigrationInterface {
  name = 'CreateOAuthAccounts1700000000001'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "oauth_accounts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "provider" varchar NOT NULL,
      "providerId" varchar NOT NULL,
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(`CREATE UNIQUE INDEX IF NOT EXISTS oauth_provider_idx ON oauth_accounts("provider", "providerId")`);
  }
  public async down(q: QueryRunner): Promise<void> { await q.query('DROP TABLE IF EXISTS "oauth_accounts"'); }
}
