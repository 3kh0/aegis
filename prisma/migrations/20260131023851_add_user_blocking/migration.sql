-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockReason" TEXT,
ADD COLUMN     "blockedUntil" TIMESTAMP(3);
