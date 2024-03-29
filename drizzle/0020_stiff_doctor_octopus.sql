CREATE TABLE IF NOT EXISTS "Comment" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userUuid" uuid NOT NULL,
	"problemSetUuid" uuid NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (0) with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Comment_uuid_key" ON "Comment" ("uuid");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_problemSetUuid_ProblemSet_uuid_fk" FOREIGN KEY ("problemSetUuid") REFERENCES "ProblemSet"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
