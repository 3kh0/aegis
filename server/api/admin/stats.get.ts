import { prisma } from "../../../prisma/db";
import { requireGlobalAdmin } from "../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const [programs, users, reports, byStatus, bySeverity] = await Promise.all([
    prisma.program.count(),
    prisma.user.count(),
    prisma.report.count(),
    prisma.report.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.report.groupBy({
      by: ["severity"],
      _count: { id: true },
    }),
  ]);

  const status = Object.fromEntries(byStatus.map((s) => [s.status, s._count.id]));
  const severity = Object.fromEntries(bySeverity.map((s) => [s.severity, s._count.id]));

  return { programs, users, reports, status, severity };
});
