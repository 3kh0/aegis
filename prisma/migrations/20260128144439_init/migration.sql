/*
  Warnings:

  - A unique constraint covering the columns `[slackId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "slackId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_key" ON "User"("slackId");
