ALTER TABLE "Comment" RENAME TO "problemSetComment";--> statement-breakpoint
ALTER TABLE "problemSetComment" DROP CONSTRAINT "Comment_userUuid_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "problemSetComment" DROP CONSTRAINT "Comment_problemSetUuid_ProblemSet_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problemSetComment" ADD CONSTRAINT "problemSetComment_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problemSetComment" ADD CONSTRAINT "problemSetComment_problemSetUuid_ProblemSet_uuid_fk" FOREIGN KEY ("problemSetUuid") REFERENCES "ProblemSet"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
