import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubtasks1700000000007 implements MigrationInterface {
  name = 'CreateSubtasks1700000000007';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "subtasks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "parentTaskId" uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      "taskId" uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(
      'CREATE INDEX IF NOT EXISTS "idx_subtasks_user_parent_task" ON "subtasks" ("userId", "parentTaskId")',
    );
    await q.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "idx_subtasks_parent_child_unique" ON "subtasks" ("userId", "parentTaskId", "taskId")',
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE IF EXISTS "subtasks"');
  }
}
