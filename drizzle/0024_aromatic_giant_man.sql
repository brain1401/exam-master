CREATE TABLE IF NOT EXISTS "PublicProblemResult" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"order" integer NOT NULL,
	"question" text NOT NULL,
	"questionType" text NOT NULL,
	"additionalView" text,
	"publicResultUuid" uuid NOT NULL,
	"isCorrect" boolean NOT NULL,
	"candidates" jsonb,
	"isAnswerMultiple" boolean NOT NULL,
	"userUuId" uuid NOT NULL,
	"imageUuid" uuid,
	"subjectiveAnswered" text,
	"correctSubjectiveAnswer" text,
	"correctCandidates" jsonb,
	"createdAt" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (0) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PublicResult" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userUuid" uuid NOT NULL,
	"publicProblemSetUuid" uuid NOT NULL,
	"createdAt" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (0) with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PublicProblemResult_uuid_key" ON "PublicProblemResult" ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PublicResult_uuid_key" ON "PublicResult" ("uuid");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicProblemResult" ADD CONSTRAINT "PublicProblemResult_publicResultUuid_PublicResult_uuid_fk" FOREIGN KEY ("publicResultUuid") REFERENCES "PublicResult"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicProblemResult" ADD CONSTRAINT "PublicProblemResult_userUuId_User_uuid_fk" FOREIGN KEY ("userUuId") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicProblemResult" ADD CONSTRAINT "PublicProblemResult_imageUuid_Image_uuid_fk" FOREIGN KEY ("imageUuid") REFERENCES "Image"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicResult" ADD CONSTRAINT "PublicResult_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PublicResult" ADD CONSTRAINT "PublicResult_publicProblemSetUuid_ProblemSet_uuid_fk" FOREIGN KEY ("publicProblemSetUuid") REFERENCES "ProblemSet"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
