import { prisma } from "../../../../prisma/db";

export default defineEventHandler(async (event) => {
  const s = await getUserSession(event);
  if (!s.user?.id) throw createError({ status: 401, message: "Not authenticated" });

  await prisma.user.update({
    where: { id: s.user.id },
    data: { hackClubId: null },
  });

  return { ok: true };
});
