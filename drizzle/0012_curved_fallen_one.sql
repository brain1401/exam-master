ALTER TABLE "_ImageToUser" ADD COLUMN "id" integer DEFAULT nextval('imageToUser_id_seq'::regclass) NOT NULL;--> statement-breakpoint
ALTER TABLE "_LikedProblemSets" ADD COLUMN "id" integer DEFAULT nextval('likedProblemSets_id_seq'::regclass) NOT NULL;