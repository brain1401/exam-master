DROP TABLE "_ImageToUser";--> statement-breakpoint
ALTER TABLE "Image" ADD COLUMN "userUuid" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Image" ADD CONSTRAINT "Image_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
