ALTER TABLE "ProblemSet" ADD COLUMN "timeLimit" integer;--> statement-breakpoint
ALTER TABLE "ProblemSet" DROP COLUMN IF EXISTS "isShareLinkPurposeSet";