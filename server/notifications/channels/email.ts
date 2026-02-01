interface Params {
  to: string;
  username: string;
  subject: string;
  message: string;
  url: string;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendEmail({ to, username, subject, message, url }: Params): Promise<void> {
  const cfg = useRuntimeConfig();
  const html = `<p>Hello ${esc(username)},</p><p>${esc(message)}</p><p><a href="${url}">View more details</a></p>`;

  if (!cfg.resendApiKey) {
    console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}\n  ${message}\n  ${url}`);
    return;
  }

  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.resendApiKey}`, "Content-Type": "application/json" },
    body: { from: cfg.emailFrom, to, subject, html },
  });
}
