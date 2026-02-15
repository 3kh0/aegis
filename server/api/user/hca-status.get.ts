import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const s = await getUserSession(event);
  if (!s.user?.id) throw createError({ status: 401 });

  const u = await prisma.user.findUnique({ where: { id: s.user.id }, select: { hackClubId: true } });
  return { connected: !!u?.hackClubId, hackClubId: u?.hackClubId ?? null };
});
