import { timingSafeEqual } from "crypto";
import { prisma } from "../../../../prisma/db";

const TTL = 10 * 60 * 1000;
const err = (r: string) => `/settings?slack=error&reason=${encodeURIComponent(r)}`;

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event);
  if (!sess.user?.id) return sendRedirect(event, err("session_expired"));

  const clientId = process.env.NUXT_SLACK_CLIENT_ID;
  const clientSecret = process.env.NUXT_SLACK_CLIENT_SECRET;
  const { siteUrl } = useRuntimeConfig(event);
  const q = getQuery(event);

  if (q.error) return sendRedirect(event, err(q.error as string));
  if (!q.code) return sendRedirect(event, err("missing_code"));
  if (!clientId || !clientSecret) return sendRedirect(event, err("not_configured"));

  const raw = getCookie(event, "slack_state");
  if (!raw) return sendRedirect(event, err("oauth_expired"));

  let st: { s: string; t: number };
  try {
    st = JSON.parse(raw);
  } catch {
    return sendRedirect(event, err("invalid_session"));
  }

  deleteCookie(event, "slack_state", { path: "/" });

  const recv = q.state as string;
  if (!recv || !st.s) return sendRedirect(event, err("missing_state"));

  const a = Buffer.from(st.s);
  const b = Buffer.from(recv);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return sendRedirect(event, err("invalid_state"));
  }

  if (Date.now() - st.t > TTL) return sendRedirect(event, err("state_expired"));

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: q.code as string,
      redirect_uri: `${siteUrl}/api/auth/slack/callback`,
    });

    const tok = await $fetch<{ ok: boolean; authed_user?: { id: string }; error?: string }>("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!tok.ok || !tok.authed_user?.id) {
      return sendRedirect(event, err(tok.error || "token_exchange_failed"));
    }

    await prisma.user.update({
      where: { id: sess.user.id },
      data: { slackId: tok.authed_user.id },
    });

    return sendRedirect(event, "/settings?slack=connected");
  } catch {
    return sendRedirect(event, err("network_error"));
  }
});
