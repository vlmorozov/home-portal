import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskListTasks1700000000009 implements MigrationInterface {
  name = 'CreateTaskListTasks1700000000009';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "task_list_tasks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "taskListId" uuid NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
      "taskId" uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(
      'CREATE INDEX IF NOT EXISTS "idx_task_list_tasks_user_list" ON "task_list_tasks" ("userId", "taskListId")',
    );
    await q.query(
      'CREATE INDEX IF NOT EXISTS "idx_task_list_tasks_user_task" ON "task_list_tasks" ("userId", "taskId")',
    );
    await q.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "idx_task_list_tasks_unique" ON "task_list_tasks" ("userId", "taskListId", "taskId")',
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE IF EXISTS "task_list_tasks"');
  }
}
