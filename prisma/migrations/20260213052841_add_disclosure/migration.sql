-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'DISCLOSURE_SET';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "adminSummary" VARCHAR(10000),
ADD COLUMN     "disclosedAt" TIMESTAMP(3),
ADD COLUMN     "disclosedById" TEXT,
ADD COLUMN     "disclosureType" TEXT,
ADD COLUMN     "reporterSummary" VARCHAR(10000);
