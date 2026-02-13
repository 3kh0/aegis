import type { Severity, ReportStatus } from "../../prisma/db";
import { prisma } from "../../prisma/db";
import { notify } from "../notifications";

interface FileInfo {
  url: string;
  name: string;
  size: number;
}

interface CreateReportData {
  title: string;
  description: string;
  severity: Severity;
  submittedById: string;
  programId?: string;
  vulnType?: string;
  affectedAsset?: string;
  assetUrl?: string;
  impact?: string;
  attachments?: FileInfo[];
  isUnlisted?: boolean;
  targetName?: string;
  targetUrl?: string;
}

export async function createReport(data: CreateReportData) {
  return prisma.$transaction(async (tx) => {
    let members: { id: string; username: string | null; email: string }[] = [];
    if (data.programId) {
      const p = await tx.program.findUnique({
        where: { id: data.programId },
        include: { members: { include: { user: { select: { id: true, username: true, email: true } } } } },
      });
      if (p) members = p.members.map((m) => m.user);
    }

    const participants = members.map((m) => ({
      userId: m.id,
      username: m.username || "unknown",
      role: "triage" as const,
      joinedAt: new Date().toISOString(),
    }));

    const report = await tx.report.create({
      data: {
        title: data.title,
        description: data.description,
        severity: data.severity,
        submittedById: data.submittedById,
        programId: data.programId,
        vulnType: data.vulnType || null,
        affectedAsset: data.affectedAsset || null,
        assetUrl: data.assetUrl || null,
        impact: data.impact || null,
        attachments: data.attachments || [],
        isUnlisted: data.isUnlisted || false,
        targetName: data.targetName || null,
        targetUrl: data.targetUrl || null,
        participants,
      },
    });

    await tx.activity.create({
      data: {
        type: "SUBMITTED",
        reportId: report.id,
        authorId: data.submittedById,
      },
    });

    for (const m of members) {
      await tx.activity.create({
        data: {
          type: "TRIAGE_JOINED",
          reportId: report.id,
          authorId: m.id,
        },
      });
    }

    if (data.programId) {
      notify({
        type: "REPORT_SUBMITTED",
        reportId: report.id,
        programId: data.programId,
        actorId: data.submittedById,
      }).catch(console.error);
    }

    return report;
  });
}

export async function getReportsByUser(userId: string) {
  return prisma.report.findMany({
    where: { submittedById: userId },
    include: {
      submittedBy: true,
      _count: { select: { activities: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      submittedBy: true,
      activities: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

type FieldUpdate = { field: "status"; value: ReportStatus; type: "STATUS_CHANGED" } | { field: "severity"; value: Severity; type: "SEVERITY_CHANGED" };

async function updateReportField(reportId: string, authorId: string, update: FieldUpdate) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: { status: true, severity: true },
    });

    if (!report) throw new Error("Report not found");

    const oldValue = report[update.field];
    const updated = await tx.report.update({
      where: { id: reportId },
      data: { [update.field]: update.value },
    });

    await tx.activity.create({
      data: {
        type: update.type,
        oldValue,
        newValue: update.value,
        reportId,
        authorId,
      },
    });

    notify({
      type: update.type,
      reportId,
      actorId: authorId,
      data: { from: oldValue, to: update.value },
    }).catch(console.error);

    return updated;
  });
}

export function setStatus(reportId: string, value: ReportStatus, authorId: string) {
  return updateReportField(reportId, authorId, { field: "status", value, type: "STATUS_CHANGED" });
}

export function setSeverity(reportId: string, value: Severity, authorId: string) {
  return updateReportField(reportId, authorId, { field: "severity", value, type: "SEVERITY_CHANGED" });
}

export async function setTitle(reportId: string, value: string, authorId: string) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: { title: true },
    });

    if (!report) throw new Error("Report not found");

    const updated = await tx.report.update({
      where: { id: reportId },
      data: { title: value },
    });

    await tx.activity.create({
      data: {
        type: "TITLE_CHANGED",
        oldValue: report.title,
        newValue: value,
        reportId,
        authorId,
      },
    });

    notify({
      type: "TITLE_CHANGED",
      reportId,
      actorId: authorId,
      data: { from: report.title, to: value },
    }).catch(console.error);

    return updated;
  });
}

export async function addComment(data: { content: string; reportId: string; authorId: string }) {
  const activity = await prisma.activity.create({
    data: {
      type: "COMMENT",
      content: data.content,
      reportId: data.reportId,
      authorId: data.authorId,
    },
  });

  notify({
    type: "COMMENT_ADDED",
    reportId: data.reportId,
    actorId: data.authorId,
    data: { activityId: activity.id },
  }).catch(console.error);

  return { success: true };
}

export async function setProgram(reportId: string, programId: string | null, authorId: string) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      include: { program: { select: { title: true } } },
    });

    if (!report) throw new Error("Report not found");

    let newProgram = null;
    if (programId) {
      newProgram = await tx.program.findUnique({
        where: { id: programId },
        select: { id: true, title: true },
      });
      if (!newProgram) throw new Error("Program not found");
    }

    const oldValue = report.program?.title || "Unlisted";
    const newValue = newProgram?.title || "Unlisted";

    await tx.report.update({
      where: { id: reportId },
      data: { programId: programId || null },
    });

    await tx.activity.create({
      data: {
        type: "PROGRAM_CHANGED",
        oldValue,
        newValue,
        reportId,
        authorId,
      },
    });

    notify({
      type: "PROGRAM_CHANGED",
      reportId,
      actorId: authorId,
      data: { from: oldValue, to: newValue },
    }).catch(console.error);

    return { success: true };
  });
}

export async function setDisclosure(reportId: string, type: string, authorId: string) {
  return prisma.$transaction(async (tx) => {
    const r = await tx.report.findUnique({ where: { id: reportId }, select: { id: true } });
    if (!r) throw new Error("Report not found");

    const updated = await tx.report.update({
      where: { id: reportId },
      data: { disclosureType: type, disclosedAt: new Date(), disclosedById: authorId },
    });

    await tx.activity.create({
      data: { type: "DISCLOSURE_SET", reportId, authorId, newValue: type },
    });

    notify({ type: "DISCLOSURE_SET", reportId, actorId: authorId }).catch(console.error);
    return updated;
  });
}

export async function setDisclosureSummary(reportId: string, field: "adminSummary" | "reporterSummary", value: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { [field]: value },
  });
}
