interface Ctx {
  baseUrl: string;
  actor: string;
  report?: { id: string; title: string; programId?: string | null };
  program?: { id: string; title: string; slug: string };
  data: Record<string, string>;
}

type Recipient = "report_owner" | "report_participants" | "program_admins" | "direct";

interface Config {
  recipients: Recipient;
  message: (c: Ctx) => string;
  subject: (c: Ctx) => string;
  url: (c: Ctx) => string;
}

const rUrl = (c: Ctx) => `${c.baseUrl}/reports/${c.report?.id}`;

export const notifications: Record<string, Config> = {
  REPORT_SUBMITTED: {
    recipients: "program_admins",
    message: (c) => `${c.actor} submitted a new report "${c.report?.title}" to ${c.program?.title}.`,
    subject: (c) => `New report: ${c.report?.title}`,
    url: rUrl,
  },
  COMMENT_ADDED: {
    recipients: "report_participants",
    message: (c) => `${c.actor} commented on your report "${c.report?.title}".`,
    subject: (c) => `New comment on ${c.report?.title}`,
    url: (c) => `${rUrl(c)}#${c.data.activityId}`,
  },
  STATUS_CHANGED: {
    recipients: "report_participants",
    message: (c) => `${c.actor} changed the status of your report "${c.report?.title}" from ${c.data.from} to ${c.data.to}.`,
    subject: (c) => `Status changed: ${c.report?.title}`,
    url: rUrl,
  },
  SEVERITY_CHANGED: {
    recipients: "report_participants",
    message: (c) => `${c.actor} changed the severity of your report "${c.report?.title}" from ${c.data.from} to ${c.data.to}.`,
    subject: (c) => `Severity changed: ${c.report?.title}`,
    url: rUrl,
  },
  TITLE_CHANGED: {
    recipients: "report_participants",
    message: (c) => `${c.actor} changed the title of your report from "${c.data.from}" to "${c.data.to}".`,
    subject: (c) => `Title changed: ${c.report?.title}`,
    url: rUrl,
  },
  PROGRAM_CHANGED: {
    recipients: "report_participants",
    message: (c) => `${c.actor} moved your report "${c.report?.title}" from ${c.data.from} to ${c.data.to}.`,
    subject: (c) => `Program changed: ${c.report?.title}`,
    url: rUrl,
  },
  TRIAGE_JOINED: {
    recipients: "report_owner",
    message: (c) => `${c.actor} joined your report "${c.report?.title}".`,
    subject: (c) => `${c.actor} joined ${c.report?.title}`,
    url: rUrl,
  },
  PROGRAM_INVITE: {
    recipients: "direct",
    message: (c) => `${c.actor} invited you to manage ${c.program?.title}.`,
    subject: (c) => `You've been invited to ${c.program?.title}`,
    url: (c) => `${c.baseUrl}/admin/programs/${c.program?.slug}`,
  },
  DISCLOSURE_SET: {
    recipients: "report_participants",
    message: (c) => `${c.actor} disclosed the report "${c.report?.title}".`,
    subject: (c) => `Report disclosed: ${c.report?.title}`,
    url: rUrl,
  },
};

export type NotificationType = keyof typeof notifications;
