import crypto from "node:crypto";
import { prisma } from "../../prisma/db";

export async function init(userId: string, newEmail: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiry = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      pendingEmail: newEmail.toLowerCase(),
      pendingEmailToken: token,
      pendingEmailExpiry: expiry,
    },
  });

  return token;
}

export async function verify(token: string): Promise<{ userId: string; oldEmail: string; newEmail: string } | null> {
  const user = await prisma.user.findUnique({ where: { pendingEmailToken: token } });

  if (!user || !user.pendingEmail || !user.pendingEmailExpiry) return null;
  if (user.pendingEmailExpiry <= new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingEmail: null, pendingEmailToken: null, pendingEmailExpiry: null },
    });
    return null;
  }

  const oldEmail = user.email;
  const newEmail = user.pendingEmail;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: newEmail,
      pendingEmail: null,
      pendingEmailToken: null,
      pendingEmailExpiry: null,
    },
  });

  return { userId: user.id, oldEmail, newEmail };
}

export async function sendVerification(newEmail: string, token: string): Promise<void> {
  const config = useRuntimeConfig();
  const r = config.resendApiKey;
  const u = config.siteUrl || "http://localhost:3000";
  const v = `${u}/api/auth/verify-email?t=${encodeURIComponent(token)}`;

  if (!r) {
    console.log(`[DEV] email change verification for ${newEmail}: ${v}`);
    return;
  }

  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${r}`, "Content-Type": "application/json" },
    body: {
      from: config.emailFrom,
      to: newEmail,
      subject: "Confirm your new email address for Aegis",
      html: `
        <h2>Confirm Your Email Change</h2>
        <p>You requested to change your Aegis account email to this address.</p>
        <p><a href="${v}">Click here to confirm your email change</a></p>
        <p>This link expires in 30 minutes. If you do not recognize this, please contact us immediately at <a href="mailto:security@hackclub.com">security@hackclub.com</a> as your account may be compromised.</p>
      `,
    },
  });
}

export async function sendConfirm(email: string, isOldEmail: boolean): Promise<void> {
  const config = useRuntimeConfig();
  const r = config.resendApiKey;

  if (!r) {
    console.log(`[DEV] email change confirmation sent to ${email} (${isOldEmail ? "old" : "new"})`);
    return;
  }

  const message = isOldEmail ? `Your Aegis account email has been changed to a new email address. If you do not recognize this, please contact us immediately at <a href="mailto:security@hackclub.com">security@hackclub.com</a> so we can help recover your account.` : "Your email has been successfully updated. You can now use this email to log in.";

  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${r}`, "Content-Type": "application/json" },
    body: {
      from: config.emailFrom,
      to: email,
      subject: "Your Aegis account email has been changed",
      html: `
        <h2>Email Change ${isOldEmail ? "Notice" : "Confirmed"}</h2>
        <p>${message}</p>
        <p>For your security, you have been logged out of all sessions.</p>
      `,
    },
  });
}
