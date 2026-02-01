import { randomBytes, timingSafeEqual } from "crypto";
import { upsertHCA } from "../../utils/users";
import { checkTo } from "../../utils/api";

const BASE = "https://auth.hackclub.com/oauth";
const TTL = 10 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const { hackclub } = useRuntimeConfig(event);
  const q = getQuery(event);
  const uri = `${getRequestProtocol(event)}://${getRequestHost(event)}/api/auth/hackclub`;

  if (!hackclub.clientId || !hackclub.clientSecret) {
    throw createError({ status: 500, message: "Hack Club OAuth not configured" });
  }

  if (q.error) {
    throw createError({ status: 401, message: (q.error_description as string) || "OAuth error" });
  }

  if (!q.code) {
    const s = randomBytes(32).toString("base64url");
    const to = checkTo(q.to as string | undefined);
    setCookie(event, "oauth_state", JSON.stringify({ s, to, t: Date.now() }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: TTL / 1000,
      path: "/",
    });

    const u = new URL(`${BASE}/authorize`);
    u.searchParams.set("client_id", hackclub.clientId);
    u.searchParams.set("redirect_uri", uri);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("scope", "openid email");
    u.searchParams.set("state", s);
    return sendRedirect(event, u.toString());
  }

  const raw = getCookie(event, "oauth_state");
  if (!raw) throw createError({ status: 401, message: "OAuth session expired" });

  let st: { s: string; to: string; t: number };
  try {
    st = JSON.parse(raw);
  } catch {
    throw createError({ status: 401, message: "Invalid OAuth session" });
  }

  deleteCookie(event, "oauth_state", { path: "/" });

  const recv = q.state as string;
  if (!recv || !st.s) throw createError({ status: 401, message: "Missing state" });

  const a = Buffer.from(st.s);
  const b = Buffer.from(recv);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw createError({ status: 401, message: "Invalid state" });
  }

  if (Date.now() - st.t > TTL) throw createError({ status: 401, message: "Session expired" });

  const body = new URLSearchParams({
    client_id: hackclub.clientId,
    client_secret: hackclub.clientSecret,
    redirect_uri: uri,
    code: q.code as string,
    grant_type: "authorization_code",
  });

  const { access_token } = await $fetch<{ access_token: string }>(`${BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const { sub, email, email_verified } = await $fetch<{
    sub: string;
    email: string;
    email_verified?: boolean;
  }>(`${BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!email) throw createError({ status: 400, message: "No email" });
  if (email_verified !== true) throw createError({ status: 400, message: "Email not verified" });

  const u = await upsertHCA(sub, email.toLowerCase());

  await setUserSession(event, {
    user: { id: u.id, email: u.email, username: u.username, role: u.role },
  });

  return sendRedirect(event, u.username ? st.to : `/auth/verify?new=1&to=${encodeURIComponent(st.to)}`);
});
