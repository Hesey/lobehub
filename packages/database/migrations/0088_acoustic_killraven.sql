ALTER TABLE "agent_eval_datasets" ADD COLUMN IF NOT EXISTS "eval_mode" text;--> statement-breakpoint
ALTER TABLE "agent_eval_datasets" ADD COLUMN IF NOT EXISTS "eval_config" jsonb;--> statement-breakpoint
ALTER TABLE "agent_eval_test_cases" ADD COLUMN IF NOT EXISTS "eval_mode" text;--> statement-breakpoint
ALTER TABLE "agent_eval_test_cases" ADD COLUMN IF NOT EXISTS "eval_config" jsonb;
