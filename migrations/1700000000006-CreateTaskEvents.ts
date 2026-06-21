import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskEvents1700000000006 implements MigrationInterface {
  name = 'CreateTaskEvents1700000000006'

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "task_events" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "taskId" uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "status" varchar(32) NOT NULL DEFAULT 'pending',
      "dueDate" timestamptz NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query('CREATE INDEX IF NOT EXISTS "idx_task_events_user_task" ON "task_events" ("userId", "taskId")');
    await q.query('CREATE INDEX IF NOT EXISTS "idx_task_events_user_due_date" ON "task_events" ("userId", "dueDate")');
    await q.query(`INSERT INTO "task_events" ("taskId", "userId", "status", "dueDate", "createdAt", "updatedAt")
      SELECT "id", "userId", "status", "dueDate", "createdAt", "updatedAt"
      FROM "tasks"
      WHERE NOT EXISTS (
        SELECT 1 FROM "task_events" WHERE "task_events"."taskId" = "tasks"."id"
      )`);
    await q.query('ALTER TABLE "tasks" DROP COLUMN "status"');
    await q.query('ALTER TABLE "tasks" DROP COLUMN "dueDate"');
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE "tasks" ADD COLUMN "status" varchar(32) NOT NULL DEFAULT \'pending\'');
    await q.query('ALTER TABLE "tasks" ADD COLUMN "dueDate" timestamptz NULL');
    await q.query(`UPDATE "tasks"
      SET
        "status" = latest."status",
        "dueDate" = latest."dueDate"
      FROM (
        SELECT DISTINCT ON ("taskId") "taskId", "status", "dueDate"
        FROM "task_events"
        ORDER BY "taskId", "createdAt" DESC
      ) latest
      WHERE latest."taskId" = "tasks"."id"`);
    await q.query('DROP TABLE IF EXISTS "task_events"');
  }
}
