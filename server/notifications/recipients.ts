import { prisma } from "../../prisma/db";

type RecipientType = "report_owner" | "report_participants" | "program_admins" | "direct";
type Params = { reportId?: string; programId?: string; userId?: string };

export async function getRecipients(type: RecipientType, p: Params, excludeId: string) {
  let ids: string[] = [];

  switch (type) {
    case "report_owner": {
      const r = await prisma.report.findUnique({ where: { id: p.reportId }, select: { submittedById: true } });
      ids = r ? [r.submittedById] : [];
      break;
    }
    case "report_participants": {
      const r = await prisma.report.findUnique({ where: { id: p.reportId }, select: { submittedById: true, participants: true } });
      if (r) {
        const parts = (r.participants as Array<{ userId: string }>) || [];
        ids = [r.submittedById, ...parts.map((x) => x.userId)];
      }
      break;
    }
    case "program_admins": {
      const [members, globals] = await Promise.all([prisma.programMember.findMany({ where: { programId: p.programId }, select: { userId: true } }), prisma.user.findMany({ where: { role: "GLOBAL_ADMIN" }, select: { id: true } })]);
      ids = [...members.map((m) => m.userId), ...globals.map((g) => g.id)];
      break;
    }
    case "direct": {
      ids = p.userId ? [p.userId] : [];
      break;
    }
  }

  const unique = [...new Set(ids)].filter((id) => id !== excludeId);
  if (!unique.length) return [];

  return prisma.user.findMany({ where: { id: { in: unique } }, select: { id: true, email: true, username: true } });
}
