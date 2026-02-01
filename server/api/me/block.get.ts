import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { blockedUntil: true, blockReason: true },
  });
  if (!u) throw createError({ status: 401, message: "Not found" });

  const blocked = u.blockedUntil && u.blockedUntil > new Date();
  return { blocked, blockedUntil: u.blockedUntil, reason: u.blockReason };
});
