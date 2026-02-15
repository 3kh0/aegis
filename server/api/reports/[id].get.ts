import { getReportWithAccessCheck, isAdmin, isGlobalAdmin, parseParticipants } from "../../utils/permissions";
import { requireParam } from "../../utils/api";
import type { UserRole } from "../../../prisma/db";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const id = requireParam(event, "id");

  let u: { id: string; role: string } | null = null;
  try {
    const s = await getUserSession(event);
    if (s?.user?.id) {
      const found = await prisma.user.findUnique({ where: { id: s.user.id }, select: { id: true, role: true } });
      if (found) u = found;
    }
  } catch {
    /* for our anons */
  }

  if (!u) {
    const r = await prisma.report.findUnique({
      where: { id },
      include: { submittedBy: true, program: true, activities: { include: { author: true }, orderBy: { createdAt: "asc" } } },
    });
    if (!r || !r.disclosureType) throw createError({ status: 404, message: "Report not found" });
    return returnDisclosed(r);
  }

  const result = await getReportWithAccessCheck(id, u.id, u.role as UserRole);
  if (!result) throw createError({ status: 404, message: "Report not found" });

  const { report, access } = result;

  if (!access.canView) {
    if (report.disclosureType) return returnDisclosed(report);
    throw createError({ status: 403, message: "Access denied" });
  }

  if (access.needsBreakGlass) {
    return {
      id: report.id,
      title: report.title,
      severity: report.severity,
      status: report.status,
      createdAt: report.createdAt,
      submittedBy: { username: report.submittedBy.deleted ? "[deleted]" : report.submittedBy.username, verified: report.submittedBy.deleted ? false : report.submittedBy.verified },
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
      username: a.author.deleted ? "[deleted]" : a.author.username,
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
    submittedBy: { username: report.submittedBy.deleted ? "[deleted]" : report.submittedBy.username, verified: report.submittedBy.deleted ? false : report.submittedBy.verified },
    program: report.program ? { slug: report.program.slug, title: report.program.title } : null,
    participants,
    activities,
    attachments: report.attachments,
    disclosureType: report.disclosureType,
    disclosedAt: report.disclosedAt,
    adminSummary: report.adminSummary,
    reporterSummary: report.reporterSummary,
    access,
  };
});

function returnDisclosed(report: Record<string, unknown> & { activities?: Array<Record<string, unknown> & { author: Record<string, unknown> }> }) {
  const base = {
    id: report.id,
    title: report.title,
    severity: report.severity,
    status: report.status,
    createdAt: report.createdAt,
    submittedBy: { username: report.submittedBy.deleted ? "[deleted]" : report.submittedBy.username, verified: report.submittedBy.deleted ? false : report.submittedBy.verified },
    program: report.program ? { slug: report.program.slug, title: report.program.title } : null,
    disclosureType: report.disclosureType,
    disclosedAt: report.disclosedAt,
    disclosed: true,
    access: {
      canView: false,
      canViewDetails: false,
      canTriage: false,
      canChangeStatus: false,
      canChangeSeverity: false,
      canReassignProgram: false,
      canDisclose: false,
      isOwner: false,
      isAdmin: false,
      isGlobalAdmin: false,
      isProgramAdmin: false,
      isTriage: false,
      needsBreakGlass: false,
    },
  };

  if (report.disclosureType === "FULL") {
    const activities =
      report.activities?.map((a) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        oldValue: a.oldValue,
        newValue: a.newValue,
        createdAt: a.createdAt,
        author: { username: a.author.deleted ? "[deleted]" : a.author.username, isAdmin: isAdmin(a.author.role), isGlobalAdmin: isGlobalAdmin(a.author.role), isOP: a.author.id === report.submittedById },
      })) || [];
    return { ...base, description: report.description, activities, attachments: report.attachments };
  }

  return { ...base, adminSummary: report.adminSummary, reporterSummary: report.reporterSummary };
}
