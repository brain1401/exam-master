ALTER TABLE "Result" DROP CONSTRAINT "Result_problemSetUuid_ProblemSet_uuid_fk";
--> statement-breakpoint
ALTER TABLE "Result" ADD COLUMN "problemSetName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Result" DROP COLUMN IF EXISTS "problemSetUuid";