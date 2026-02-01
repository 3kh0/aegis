import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event);
  if (!sess.user?.id) throw createError({ status: 401, message: "Not authenticated" });

  const u = await prisma.user.findUnique({ where: { id: sess.user.id }, select: { slackId: true } });
  return { connected: !!u?.slackId };
});
