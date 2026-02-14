import { getUser } from "../../utils/api";
import { Prisma } from "../../../prisma/generated/client";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const u = await getUser(event);

  const match = await prisma.$queryRaw<{ id: string }[]>(
    Prisma.sql`SELECT id FROM "Report" WHERE "submittedById" = ${u.id} OR "participants"::jsonb @> ${JSON.stringify([{ userId: u.id }])}::jsonb ORDER BY "createdAt" DESC`,
  );

  if (match.length === 0) return [];

  return prisma.report.findMany({
    where: { id: { in: match.map((r) => r.id) } },
    select: {
      id: true,
      title: true,
      severity: true,
      status: true,
      createdAt: true,
      submittedBy: { select: { username: true, verified: true } },
      program: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});
