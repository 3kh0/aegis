import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [reports, byStatus, bySeverity, recent] = await Promise.all([
    prisma.report.count(),
    prisma.report.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.report.groupBy({
      by: ["severity"],
      _count: { id: true },
    }),
    prisma.report.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
  ]);

  const status = Object.fromEntries(byStatus.map((s) => [s.status, s._count.id]));
  const severity = Object.fromEntries(bySeverity.map((s) => [s.severity, s._count.id]));

  return { reports, status, severity, recent };
});
