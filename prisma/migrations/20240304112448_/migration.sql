-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Image" (
    "uuid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ProblemSet" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "isShareLinkPurposeSet" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemSet_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Problem" (
    "uuid" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "imageUuid" TEXT,
    "candidates" JSONB,
    "additionalView" TEXT,
    "problemSetUuid" TEXT NOT NULL,
    "subjectiveAnswer" TEXT,
    "userUuid" TEXT NOT NULL,
    "isAnswerMultiple" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ProblemResult" (
    "uuid" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "additionalView" TEXT,
    "resultUuid" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "candidates" JSONB,
    "isAnswerMultiple" BOOLEAN NOT NULL,
    "userUuId" TEXT NOT NULL,
    "imageUuid" TEXT,
    "subjectiveAnswered" TEXT,
    "correctSubjectiveAnswer" TEXT,
    "correctCandidates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemResult_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Result" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "problemSetName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_ImageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Image_uuid_key" ON "Image"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSet_uuid_key" ON "ProblemSet"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_uuid_key" ON "Problem"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemResult_uuid_key" ON "ProblemResult"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Result_uuid_key" ON "Result"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToUser_AB_unique" ON "_ImageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToUser_B_index" ON "_ImageToUser"("B");

-- AddForeignKey
ALTER TABLE "ProblemSet" ADD CONSTRAINT "ProblemSet_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_imageUuid_fkey" FOREIGN KEY ("imageUuid") REFERENCES "Image"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_problemSetUuid_fkey" FOREIGN KEY ("problemSetUuid") REFERENCES "ProblemSet"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemResult" ADD CONSTRAINT "ProblemResult_resultUuid_fkey" FOREIGN KEY ("resultUuid") REFERENCES "Result"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemResult" ADD CONSTRAINT "ProblemResult_userUuId_fkey" FOREIGN KEY ("userUuId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemResult" ADD CONSTRAINT "ProblemResult_imageUuid_fkey" FOREIGN KEY ("imageUuid") REFERENCES "Image"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToUser" ADD CONSTRAINT "_ImageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToUser" ADD CONSTRAINT "_ImageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
