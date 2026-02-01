import { prisma } from "../../../../prisma/db";

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event);
  if (!sess.user?.id) throw createError({ status: 401, message: "Not authenticated" });

  await prisma.user.update({
    where: { id: sess.user.id },
    data: { slackId: null },
  });

  return { ok: true };
});
