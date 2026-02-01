import type { UserRole } from "../../prisma/db";
import { prisma } from "../../prisma/db";

export interface ReportParticipant {
  userId: string;
  username: string;
  role: "owner" | "triage";
  joinedAt: string;
}

export function isGlobalAdmin(role: UserRole): boolean {
  return role === "GLOBAL_ADMIN";
}

export function isProgramAdmin(role: UserRole): boolean {
  return role === "PROGRAM_ADMIN" || role === "GLOBAL_ADMIN";
}

export function isAdmin(role: UserRole): boolean {
  return isProgramAdmin(role);
}

export function isSuperAdmin(role: UserRole): boolean {
  return isGlobalAdmin(role);
}

export async function canAccessProgram(userId: string, programId: string, role: UserRole): Promise<boolean> {
  if (isGlobalAdmin(role)) return true;
  if (role !== "PROGRAM_ADMIN") return false;

  const assignment = await prisma.programMember.findUnique({
    where: { userId_programId: { userId, programId } },
  });
  return !!assignment;
}

export async function canAccessProgramBySlug(userId: string, slug: string, role: UserRole): Promise<boolean> {
  if (isGlobalAdmin(role)) return true;
  if (role !== "PROGRAM_ADMIN") return false;

  const program = await prisma.program.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!program) return false;

  return canAccessProgram(userId, program.id, role);
}

export async function getUserPrograms(userId: string, role: UserRole) {
  if (isGlobalAdmin(role)) {
    return prisma.program.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true, iconUrl: true },
    });
  }

  const assignments = await prisma.programMember.findMany({
    where: { userId },
    include: {
      program: {
        select: { id: true, title: true, slug: true, iconUrl: true },
      },
    },
    orderBy: { program: { title: "asc" } },
  });

  return assignments.map((a) => a.program);
}

export function parseParticipants(participants: unknown): ReportParticipant[] {
  if (!participants) return [];
  if (typeof participants === "string") {
    try {
      return JSON.parse(participants);
    } catch {
      return [];
    }
  }
  if (Array.isArray(participants)) return participants as ReportParticipant[];
  return [];
}

export function hasTriageAccess(report: { submittedById: string; participants: unknown }, userId: string): boolean {
  const participants = parseParticipants(report.participants);
  const participant = participants.find((p) => p.userId === userId);
  return participant?.role === "triage";
}

export function isReportOwner(report: { submittedById: string }, userId: string): boolean {
  return report.submittedById === userId;
}

export async function addTriage(reportId: string, userId: string, username: string): Promise<void> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { participants: true },
  });

  if (!report) throw new Error("Report not found");

  const participants = parseParticipants(report.participants);

  if (participants.some((p) => p.userId === userId)) {
    return;
  }

  const newParticipant: ReportParticipant = {
    userId,
    username,
    role: "triage",
    joinedAt: new Date().toISOString(),
  };

  await prisma.report.update({
    where: { id: reportId },
    data: {
      participants: [...participants, newParticipant],
    },
  });
}

export async function getReportWithAccessCheck(reportId: string, userId: string, userRole: UserRole) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      submittedBy: true,
      program: true,
      activities: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!report) return null;

  const hasTriage = hasTriageAccess(report, userId);
  const isOwner = isReportOwner(report, userId);
  const isAdminUser = isAdmin(userRole);

  let hasProgramAccess = false;
  if (report.programId && isProgramAdmin(userRole)) {
    hasProgramAccess = await canAccessProgram(userId, report.programId, userRole);
  }

  const canView = isOwner || isAdminUser || hasTriage || hasProgramAccess;
  const needsBreakGlass = (isAdminUser || hasProgramAccess) && !isOwner && !hasTriage;

  return {
    report,
    access: {
      canView,
      canViewDetails: isOwner || hasTriage || hasProgramAccess,
      canTriage: hasTriage || hasProgramAccess,
      canChangeStatus: hasTriage || hasProgramAccess,
      canChangeSeverity: hasTriage || hasProgramAccess,
      canReassignProgram: isGlobalAdmin(userRole),
      isOwner,
      isAdmin: isAdminUser,
      isGlobalAdmin: isGlobalAdmin(userRole),
      isProgramAdmin: hasProgramAccess,
      isTriage: hasTriage,
      needsBreakGlass,
    },
  };
}
