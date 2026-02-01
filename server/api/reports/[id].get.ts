import { getReportWithAccessCheck, isAdmin, isGlobalAdmin, parseParticipants } from "../../utils/permissions";
import { getUser, requireParam } from "../../utils/api";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const id = requireParam(event, "id");
  const u = await getUser(event);

  const result = await getReportWithAccessCheck(id, u.id, u.role);

  if (!result) {
    throw createError({ status: 404, message: "Report not found" });
  }

  const { report, access } = result;

  if (!access.canView) {
    throw createError({ status: 403, message: "Access denied" });
  }

  if (access.needsBreakGlass) {
    return {
      id: report.id,
      title: report.title,
      severity: report.severity,
      status: report.status,
      createdAt: report.createdAt,
      submittedBy: { username: report.submittedBy.username, verified: report.submittedBy.verified },
      needsBreakGlass: true,
      access,
    };
  }

  const activities = report.activities.map((a) => ({
    id: a.id,
    type: a.type,
    content: a.content,
    oldValue: a.oldValue,
    newValue: a.newValue,
    createdAt: a.createdAt,
    author: {
      username: a.author.username,
      isAdmin: isAdmin(a.author.role),
      isGlobalAdmin: isGlobalAdmin(a.author.role),
      isOP: a.author.id === report.submittedById,
    },
  }));

  const parsedParticipants = parseParticipants(report.participants);
  const participantIds = parsedParticipants.map((p) => p.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: participantIds } },
    select: { id: true, verified: true },
  });
  const verifiedMap = new Map(users.map((u) => [u.id, u.verified]));
  const participants = parsedParticipants.map((p) => ({
    userId: p.userId,
    username: p.username,
    verified: verifiedMap.get(p.userId) ?? false,
  }));

  return {
    id: report.id,
    title: report.title,
    description: report.description,
    severity: report.severity,
    status: report.status,
    createdAt: report.createdAt,
    submittedBy: { username: report.submittedBy.username, verified: report.submittedBy.verified },
    program: report.program ? { slug: report.program.slug, title: report.program.title } : null,
    participants,
    activities,
    attachments: report.attachments,
    access,
  };
});
