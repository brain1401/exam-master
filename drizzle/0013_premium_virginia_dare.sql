ALTER TABLE "_ImageToUser" RENAME COLUMN "id" TO "uuid";--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" RENAME COLUMN "id" TO "uuid";--> statement-breakpoint
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
ALTER TABLE "_ImageToUser" ALTER COLUMN "uuid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "_ImageToUser" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4();--> statement-breakpoint
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
ALTER TABLE "_LikedProblemSets" ALTER COLUMN "uuid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4();