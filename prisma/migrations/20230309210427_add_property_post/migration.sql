/*
  Warnings:

  - Added the required column `filename` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
