ALTER TABLE "_LikedProblemSets" ADD COLUMN "createdAt" timestamp (0) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD CONSTRAINT "_LikedProblemSets_problemSetUuid_unique" UNIQUE("problemSetUuid");--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD CONSTRAINT "_LikedProblemSets_userUuid_unique" UNIQUE("userUuid");