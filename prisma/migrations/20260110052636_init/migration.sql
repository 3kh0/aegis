-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PROGRAM_ADMIN', 'GLOBAL_ADMIN');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SUBMITTED', 'COMMENT', 'STATUS_CHANGED', 'SEVERITY_CHANGED', 'TRIAGE_JOINED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'TRIAGED', 'NEEDS_MORE_INFO', 'RESOLVED', 'INFORMATIVE', 'DUPLICATE', 'SPAM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "hackClubId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "description" VARCHAR(300),
    "website" TEXT,
    "github" TEXT,
    "publicEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vulnType" TEXT,
    "affectedAsset" TEXT,
    "assetUrl" TEXT,
    "impact" TEXT,
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "isUnlisted" BOOLEAN NOT NULL DEFAULT false,
    "targetName" TEXT,
    "targetUrl" TEXT,
    "submittedById" TEXT NOT NULL,
    "programId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "content" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "magicToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconUrl" TEXT,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_hackClubId_key" ON "User"("hackClubId");

-- CreateIndex
CREATE INDEX "ProgramMember_userId_idx" ON "ProgramMember"("userId");

-- CreateIndex
CREATE INDEX "ProgramMember_programId_idx" ON "ProgramMember"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramMember_userId_programId_key" ON "ProgramMember"("userId", "programId");

-- CreateIndex
CREATE INDEX "Report_submittedById_idx" ON "Report"("submittedById");

-- CreateIndex
CREATE INDEX "Report_programId_idx" ON "Report"("programId");

-- CreateIndex
CREATE INDEX "Report_id_idx" ON "Report"("id");

-- CreateIndex
CREATE INDEX "Activity_reportId_idx" ON "Activity"("reportId");

-- CreateIndex
CREATE INDEX "Activity_authorId_idx" ON "Activity"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_magicToken_key" ON "Otp"("magicToken");

-- CreateIndex
CREATE INDEX "Otp_email_idx" ON "Otp"("email");

-- CreateIndex
CREATE INDEX "Otp_expiresAt_idx" ON "Otp"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_slug_idx" ON "Program"("slug");

-- AddForeignKey
ALTER TABLE "ProgramMember" ADD CONSTRAINT "ProgramMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramMember" ADD CONSTRAINT "ProgramMember_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
