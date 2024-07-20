/*
  Warnings:

  - Made the column `userName` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userName` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userName` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "userName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "userName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "userName" SET NOT NULL;

-- CreateTable
CREATE TABLE "Repost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repost_userId_postId_key" ON "Repost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
