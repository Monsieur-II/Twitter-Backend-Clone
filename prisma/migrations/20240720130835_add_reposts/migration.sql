/*
  Warnings:

  - Added the required column `userName` to the `Repost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repost" ADD COLUMN     "userName" TEXT NOT NULL;
