import { prisma } from "../../../../../prisma/db";
import { requireGlobalAdmin, requireParam } from "../../../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);
  const id = requireParam(event, "id");

  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw createError({ status: 404, message: "User not found" });

  await prisma.user.update({ where: { id }, data: { blockedUntil: null, blockReason: null } });

  return { success: true };
});
