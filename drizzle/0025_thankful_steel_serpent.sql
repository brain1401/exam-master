ALTER TABLE "PublicProblemResult" DROP CONSTRAINT "PublicProblemResult_userUuId_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "PublicResult" DROP CONSTRAINT "PublicResult_userUuid_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "PublicResult" ALTER COLUMN "userUuid" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicResult" ADD CONSTRAINT "PublicResult_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "PublicProblemResult" DROP COLUMN IF EXISTS "userUuId";