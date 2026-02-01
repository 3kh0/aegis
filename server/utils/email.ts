export async function sendOTPEmail(email: string, code: string, magicToken: string): Promise<void> {
  const config = useRuntimeConfig();
  const r = config.resendApiKey;
  const u = config.siteUrl || "http://localhost:3000";
  const x = `${u}/auth/verify?x=${encodeURIComponent(email)}&c=${code}&t=${encodeURIComponent(magicToken)}`;

  if (!r) {
    console.log(`[DEV] login for ${email}: ${code}, ${x}`);
    return;
  }

  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${r}`,
      "Content-Type": "application/json",
    },
    body: {
      from: config.emailFrom,
      to: email,
      subject: `${code} is your code for Aegis`,
      html: `
        <h2>Your Login Code for Aegis</h2>
        <p><strong style="font-size: 1.5em;">${code}</strong></p>
        <p>Your code expires in 5 minutes. You can also <a href="${x}"> click here to log in instantly</a>.</p>
        <p style="color: #666; font-size: 0.9em;">Wasn't you? Ignore this email. Your account is safe. Hack Club will never ask you for login codes.</p>
      `,
    },
  });
}
