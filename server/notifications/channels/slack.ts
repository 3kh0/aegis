import { prisma } from "../../../prisma/db";

interface Params {
  userId: string;
  message: string;
  url: string;
}

export async function sendSlack({ userId, message, url }: Params): Promise<boolean> {
  try {
    const cfg = useRuntimeConfig();
    if (!cfg.slack.botToken) return false;

    const u = await prisma.user.findUnique({ where: { id: userId }, select: { slackId: true } });
    if (!u?.slackId) return false;

    const headers = { Authorization: `Bearer ${cfg.slack.botToken}`, "Content-Type": "application/json" };

    const dm = await $fetch<{ ok: boolean; channel?: { id: string }; error?: string }>("https://slack.com/api/conversations.open", { method: "POST", headers, body: { users: u.slackId } });
    if (!dm.ok || !dm.channel?.id) {
      console.error("[Slack] conversations.open failed:", dm.error);
      return false;
    }

    const msg = await $fetch<{ ok: boolean; error?: string }>("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers,
      body: {
        channel: dm.channel.id,
        text: message,
        blocks: [
          { type: "section", text: { type: "mrkdwn", text: message } },
          { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "View" }, url }] },
        ],
      },
    });

    if (!msg.ok) {
      console.error("[Slack] chat.postMessage failed:", msg.error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("[Slack] sendSlack error:", e);
    return false;
  }
}
