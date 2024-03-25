/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = '_ImageToUser'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "_ImageToUser" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = '_LikedProblemSets'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "_LikedProblemSets" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "_ImageToUser" ADD CONSTRAINT "_ImageToUser_imageUuid_userUuid_pk" PRIMARY KEY("imageUuid","userUuid");--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD CONSTRAINT "_LikedProblemSets_problemSetUuid_userUuid_pk" PRIMARY KEY("problemSetUuid","userUuid");