DROP INDEX IF EXISTS "_ImageToUser_imageuser_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "_ImageToUser_userUuid_index";--> statement-breakpoint
DROP INDEX IF EXISTS "_LikedProblemSets_AB_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "_LikedProblemSets_userUuid_index";--> statement-breakpoint
ALTER TABLE "_ImageToUser" ADD PRIMARY KEY ("imageUuid");--> statement-breakpoint
ALTER TABLE "_ImageToUser" ADD PRIMARY KEY ("userUuid");--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD PRIMARY KEY ("problemSetUuid");--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD PRIMARY KEY ("userUuid");--> statement-breakpoint
ALTER TABLE "_ImageToUser" DROP COLUMN IF EXISTS "uuid";--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" DROP COLUMN IF EXISTS "uuid";