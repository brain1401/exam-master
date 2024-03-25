CREATE TABLE IF NOT EXISTS "_ImageToUser" (
	"imageUuid" uuid NOT NULL,
	"userUuid" uuid NOT NULL,
	CONSTRAINT "_ImageToUser_imageUuid_userUuid_pk" PRIMARY KEY("imageUuid","userUuid")
);
--> statement-breakpoint
ALTER TABLE "Image" DROP CONSTRAINT "Image_userUuid_User_uuid_fk";
--> statement-breakpoint
ALTER TABLE "Image" DROP COLUMN IF EXISTS "userUuid";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ImageToUser" ADD CONSTRAINT "_ImageToUser_imageUuid_Image_uuid_fk" FOREIGN KEY ("imageUuid") REFERENCES "Image"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_ImageToUser" ADD CONSTRAINT "_ImageToUser_userUuid_User_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
