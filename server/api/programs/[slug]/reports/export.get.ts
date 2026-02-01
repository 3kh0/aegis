import { prisma } from "../../../../../prisma/db";
import { requireParam, requireProgramAccess, requireProgram } from "../../../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const program = await requireProgram(slug, { select: { id: true, title: true } });

  const reports = await prisma.report.findMany({
    where: { programId: program.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      severity: true,
      createdAt: true,
      updatedAt: true,
      submittedBy: { select: { email: true, username: true } },
    },
  });

  const escape = (s: string | null | undefined) => {
    if (!s) return "";
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headers = ["ID", "Title", "Status", "Severity", "Submitted By", "Created At", "Updated At"];
  const rows = reports.map((r) => [r.id, escape(r.title), r.status, r.severity, escape(r.submittedBy.username || r.submittedBy.email), r.createdAt.toISOString(), r.updatedAt.toISOString()]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  setHeader(event, "Content-Type", "text/csv");
  setHeader(event, "Content-Disposition", `attachment; filename="${slug}-reports.csv"`);

  return csv;
});
