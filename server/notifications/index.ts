import { prisma } from "../../prisma/db";
import { isNotificationChannel, notifications, type NotificationChannel, type NotificationType } from "./config";
import { getRecipients } from "./recipients";
import { sendEmail } from "./channels/email";
import { sendSlack } from "./channels/slack";

export interface NotifyParams {
  type: NotificationType;
  reportId?: string;
  programId?: string;
  actorId: string;
  userId?: string;
  data?: Record<string, string>;
}

export async function notify(p: NotifyParams): Promise<void> {
  const cfg = notifications[p.type];
  if (!cfg) return;

  const base = useRuntimeConfig().siteUrl || "http://localhost:3000";
  const ctx = await buildCtx(p, base);
  const recs = await getRecipients(cfg.recipients, p, p.actorId);
  if (!recs.length) return;

  const d = p.data || {};
  const msg = cfg.message({ ...ctx, data: d });
  const subj = cfg.subject({ ...ctx, data: d });
  const url = cfg.url({ ...ctx, data: d });

  for (const r of recs) {
    const channels = await getChannels(r.id, p.type);
    if (!channels.length) continue;

    const jobs: Promise<unknown>[] = [];

    if (channels.includes("email")) {
      jobs.push(
        sendEmail({ to: r.email, username: r.username || "there", subject: subj, message: msg, url }).catch((err: unknown) => {
          console.error("[Notify] Email send failed", { type: p.type, userId: r.id, error: err });
        }),
      );
    }
    if (channels.includes("slack")) {
      jobs.push(
        sendSlack({ userId: r.id, message: msg, url })
          .then((ok) => {
            if (!ok) {
              console.error("[Notify] Slack send failed", { type: p.type, userId: r.id });
            }
          })
          .catch((err: unknown) => {
            console.error("[Notify] Slack send failed", { type: p.type, userId: r.id, error: err });
          }),
      );
    }

    await Promise.all(jobs);
  }
}

interface Ctx {
  baseUrl: string;
  actor: string;
  report?: { id: string; title: string; programId?: string | null };
  program?: { id: string; title: string; slug: string };
}

async function buildCtx(p: NotifyParams, baseUrl: string): Promise<Ctx> {
  const ctx: Ctx = { baseUrl, actor: "Someone" };

  if (p.actorId) {
    const u = await prisma.user.findUnique({ where: { id: p.actorId }, select: { username: true } });
    ctx.actor = u?.username || "Someone";
  }

  if (p.reportId) {
    const r = await prisma.report.findUnique({ where: { id: p.reportId }, select: { id: true, title: true, programId: true } });
    if (r) ctx.report = r;
  }

  const pid = p.programId || ctx.report?.programId;
  if (pid) {
    const prog = await prisma.program.findUnique({ where: { id: pid }, select: { id: true, title: true, slug: true } });
    if (prog) ctx.program = prog;
  }

  return ctx;
}

async function getChannels(userId: string, type: NotificationType): Promise<NotificationChannel[]> {
  const prefs = await prisma.notificationPreference.findMany({ where: { userId, type } });
  if (!prefs.length) return ["email"];

  const validPrefs = prefs.filter((p) => isNotificationChannel(p.channel));
  if (!validPrefs.length) return ["email"];

  return validPrefs.filter((p) => p.enabled).map((p) => p.channel);
}

export { type NotificationType } from "./config";
