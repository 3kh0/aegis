import { prisma } from "../../../../../prisma/db";
import { requireGlobalAdmin } from "../../../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const userId = getRouterParam(event, "userId");
  const programId = getRouterParam(event, "programId");

  if (!userId || !programId) {
    throw createError({ status: 400, message: "Missing userId or programId" });
  }

  await prisma.programMember.delete({
    where: { userId_programId: { userId, programId } },
  });

  const remaining = await prisma.programMember.count({ where: { userId } });
  if (remaining === 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
  }

  return { ok: true };
});
