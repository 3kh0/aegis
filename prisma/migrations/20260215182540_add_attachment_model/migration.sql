-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_path_key" ON "Attachment"("path");

-- CreateIndex
CREATE INDEX "Attachment_reportId_idx" ON "Attachment"("reportId");

-- CreateIndex
CREATE INDEX "Attachment_path_idx" ON "Attachment"("path");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- backfill
INSERT INTO "Attachment" ("id", "path", "reportId", "createdAt")
SELECT
  gen_random_uuid(),
  regexp_replace(elem->>'url', '^/api/files/', ''),
  r."id",
  r."createdAt"
FROM "Report" r,
     jsonb_array_elements(r."attachments"::jsonb) AS elem
WHERE jsonb_array_length(r."attachments"::jsonb) > 0
ON CONFLICT ("path") DO NOTHING;
