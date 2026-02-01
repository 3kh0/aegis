import { parseParticipants } from "../../utils/permissions";
import { getUser } from "../../utils/api";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const u = await getUser(event);

  const all = await prisma.report.findMany({
    select: {
      id: true,
      title: true,
      severity: true,
      status: true,
      createdAt: true,
      submittedById: true,
      participants: true,
      submittedBy: { select: { username: true, verified: true } },
      program: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return all.filter((r) => r.submittedById === u.id || parseParticipants(r.participants).some((p) => p.userId === u.id)).map(({ submittedById: _, participants: __, ...r }) => r);
});
