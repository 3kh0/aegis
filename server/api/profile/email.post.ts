import { z } from "zod";
import { prisma } from "../../../prisma/db";
import { parseBody } from "../../utils/api";
import { init, sendVerification } from "../../utils/email-change";

const schema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const { email } = await parseBody(event, schema);
  const newEmail = email.toLowerCase();

  if (newEmail === s.user.email.toLowerCase()) {
    throw createError({ statusCode: 400, message: "This is " });
  }

  const existing = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existing) {
    throw createError({ statusCode: 400, message: "This email is being used by another account" });
  }

  const token = await init(s.user.id, newEmail);
  await sendVerification(newEmail, token);

  return { success: true };
});
