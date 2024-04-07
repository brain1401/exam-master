DROP TABLE "PublicProblemResult";--> statement-breakpoint
DROP TABLE "PublicResult";--> statement-breakpoint
ALTER TABLE "ProblemResult" DROP CONSTRAINT "ProblemResult_userUuId_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "Result" DROP CONSTRAINT "Result_userUuid_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "Result" ALTER COLUMN "userUuid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Result" ADD COLUMN "problemSetUuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Result" ADD COLUMN "isPublic" boolean NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Result" ADD CONSTRAINT "Result_problemSetUuid_ProblemSet_uuid_fk" FOREIGN KEY ("problemSetUuid") REFERENCES "ProblemSet"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Result" ADD CONSTRAINT "Result_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ProblemResult" DROP COLUMN IF EXISTS "userUuId";--> statement-breakpoint
ALTER TABLE "Result" DROP COLUMN IF EXISTS "problemSetName";