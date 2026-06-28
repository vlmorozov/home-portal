import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskLists1700000000008 implements MigrationInterface {
  name = 'CreateTaskLists1700000000008';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "task_lists" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "title" varchar(200) NOT NULL,
      "description" text NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(
      'CREATE INDEX IF NOT EXISTS "idx_task_lists_user" ON "task_lists" ("userId")',
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE IF EXISTS "task_lists"');
  }
}
