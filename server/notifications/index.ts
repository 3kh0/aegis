import { prisma } from "../../prisma/db";
import { notifications, type NotificationType } from "./config";
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
    const ch = await getChannels(r.id, p.type);
    if (ch.includes("email")) {
      await sendEmail({ to: r.email, username: r.username || "there", subject: subj, message: msg, url });
    }
    if (ch.includes("slack")) {
      await sendSlack({ userId: r.id, message: msg, url });
    }
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

async function getChannels(userId: string, type: NotificationType): Promise<string[]> {
  const prefs = await prisma.notificationPreference.findMany({ where: { userId, type } });
  return prefs.length ? prefs.filter((p) => p.enabled).map((p) => p.channel) : ["email"];
}

export { type NotificationType } from "./config";
