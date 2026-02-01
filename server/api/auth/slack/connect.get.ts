import { randomBytes } from "crypto";

const TTL = 10 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event);
  if (!sess.user?.id) return sendRedirect(event, "/settings?slack=error&reason=not_authenticated");

  const clientId = process.env.NUXT_SLACK_CLIENT_ID;
  const { siteUrl } = useRuntimeConfig(event);
  if (!clientId) return sendRedirect(event, "/settings?slack=error&reason=not_configured");

  const s = randomBytes(16).toString("base64url");
  setCookie(event, "slack_state", JSON.stringify({ s, t: Date.now() }), {
    httpOnly: true,
    secure: siteUrl.startsWith("https://"),
    sameSite: "lax",
    maxAge: TTL / 1000,
    path: "/",
  });

  const u = new URL("https://slack.com/oauth/v2/authorize");
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("redirect_uri", `${siteUrl}/api/auth/slack/callback`);
  u.searchParams.set("user_scope", "openid");
  u.searchParams.set("state", s);

  return sendRedirect(event, u.toString());
});
