import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submittedBy: { select: { email: true, username: true } },
      program: { select: { title: true, slug: true } },
    },
  });

  const rows = [["ID", "Title", "Program", "Status", "Severity", "Reporter", "Created At"].join(",")];

  for (const r of reports) {
    const row = [r.id, `"${r.title.replace(/"/g, '""')}"`, r.program.title, r.status, r.severity, r.submittedBy.username || r.submittedBy.email, r.createdAt.toISOString()];
    rows.push(row.join(","));
  }

  setHeader(event, "Content-Type", "text/csv");
  setHeader(event, "Content-Disposition", `attachment; filename="all-reports-${new Date().toISOString().slice(0, 10)}.csv"`);

  return rows.join("\n");
});
