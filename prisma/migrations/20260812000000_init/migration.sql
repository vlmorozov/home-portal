CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" varchar(64) NOT NULL UNIQUE,
  "email" varchar(254) NOT NULL UNIQUE,
  "phone" varchar(32) UNIQUE,
  "passwordHash" varchar,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "oauth_accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" varchar NOT NULL,
  "providerId" varchar NOT NULL,
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "oauth_accounts_provider_providerId_key" UNIQUE ("provider", "providerId")
);

CREATE TABLE "email_verification_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" varchar NOT NULL UNIQUE,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "refresh_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" varchar NOT NULL UNIQUE,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "revokedAt" timestamptz
);

CREATE TABLE "password_reset_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" varchar NOT NULL UNIQUE,
  "channel" varchar(16) NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(200) NOT NULL,
  "description" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "tasks_userId_idx" ON "tasks" ("userId");

CREATE TABLE "task_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "taskId" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" varchar(32) NOT NULL DEFAULT 'pending',
  "dueDate" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "task_events_userId_taskId_idx" ON "task_events" ("userId", "taskId");
CREATE INDEX "task_events_userId_dueDate_idx" ON "task_events" ("userId", "dueDate");

CREATE TABLE "subtasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "parentTaskId" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "taskId" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "subtasks_userId_parentTaskId_taskId_key" ON "subtasks" ("userId", "parentTaskId", "taskId");
CREATE INDEX "subtasks_userId_parentTaskId_idx" ON "subtasks" ("userId", "parentTaskId");

CREATE TABLE "task_lists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(200) NOT NULL,
  "description" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "task_lists_userId_idx" ON "task_lists" ("userId");

CREATE TABLE "task_list_tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "taskListId" uuid NOT NULL REFERENCES "task_lists"("id") ON DELETE CASCADE,
  "taskId" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "task_list_tasks_userId_taskListId_taskId_key" ON "task_list_tasks" ("userId", "taskListId", "taskId");
CREATE INDEX "task_list_tasks_userId_taskListId_idx" ON "task_list_tasks" ("userId", "taskListId");
CREATE INDEX "task_list_tasks_userId_taskId_idx" ON "task_list_tasks" ("userId", "taskId");
