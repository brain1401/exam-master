-- AlterTable
ALTER TABLE "ProblemSet" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_LikedProblemSets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedProblemSets_AB_unique" ON "_LikedProblemSets"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedProblemSets_B_index" ON "_LikedProblemSets"("B");

-- AddForeignKey
ALTER TABLE "_LikedProblemSets" ADD CONSTRAINT "_LikedProblemSets_A_fkey" FOREIGN KEY ("A") REFERENCES "ProblemSet"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedProblemSets" ADD CONSTRAINT "_LikedProblemSets_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
