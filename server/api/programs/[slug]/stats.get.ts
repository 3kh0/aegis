import { prisma } from "../../../../prisma/db";
import { requireParam, requireProgramAccess, requireProgram } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const program = await requireProgram(slug, { select: { id: true } });

  const [total, byStatus, bySeverity, recent] = await Promise.all([
    prisma.report.count({ where: { programId: program.id } }),
    prisma.report.groupBy({
      by: ["status"],
      where: { programId: program.id },
      _count: { id: true },
    }),
    prisma.report.groupBy({
      by: ["severity"],
      where: { programId: program.id },
      _count: { id: true },
    }),
    prisma.report.count({
      where: {
        programId: program.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const status = Object.fromEntries(byStatus.map((s) => [s.status, s._count.id]));
  const severity = Object.fromEntries(bySeverity.map((s) => [s.severity, s._count.id]));

  return { total, recent, status, severity };
});
