import { verifyCode, verifyToken } from "../../utils/otp";
import { upsertEmail } from "../../utils/users";
import { parseBody } from "../../utils/api";
import { otpSchema } from "../../utils/schemas";

export default defineEventHandler(async (event) => {
  const { email, code, token } = await parseBody(event, otpSchema);

  let e: string | null = null;

  if (token) {
    e = await verifyToken(token);
  } else if (email && code && (await verifyCode(email, code))) {
    e = email.toLowerCase();
  }

  if (!e) throw createError({ status: 401, message: "Invalid, please try again" });

  const u = await upsertEmail(e);

  await setUserSession(event, {
    user: { id: u.id, email: u.email, username: u.username, role: u.role },
  });

  return { success: true, needsUsername: !u.username };
});
