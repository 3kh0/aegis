import { z } from "zod";
import { prisma } from "../../../../../prisma/db";
import { parseBody, requireGlobalAdmin, requireParam } from "../../../../utils/api";

const schema = z.object({
  duration: z.number().min(1).max(365),
  reason: z.string().min(1).max(500),
});

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);
  const id = requireParam(event, "id");
  const { duration, reason } = await parseBody(event, schema);

  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw createError({ status: 404, message: "User not found" });
  if (u.role === "GLOBAL_ADMIN") throw createError({ status: 400, message: "Cannot block admins" });

  const blockedUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
  await prisma.user.update({ where: { id }, data: { blockedUntil, blockReason: reason } });

  return { blockedUntil, reason };
});
