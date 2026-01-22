import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1700000000004 implements MigrationInterface {
  name = 'CreateTasks1700000000004'
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "tasks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "title" varchar(200) NOT NULL,
      "description" text NULL,
      "status" varchar(32) NOT NULL DEFAULT 'pending',
      "dueDate" timestamptz NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query('CREATE INDEX IF NOT EXISTS "idx_tasks_user" ON "tasks" ("userId")');
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE IF EXISTS "tasks"');
  }
}
