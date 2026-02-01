import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { parseBody, requireGlobalAdmin, requireParam } from "../../../utils/api";

const schema = z.object({
  role: z.enum(["USER", "PROGRAM_ADMIN", "GLOBAL_ADMIN"]).optional(),
  verified: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const admin = await requireGlobalAdmin(event);
  const id = requireParam(event, "id");
  const data = await parseBody(event, schema);

  if (id === admin.id && data.role && data.role !== "GLOBAL_ADMIN") {
    throw createError({ status: 400, message: "Cannot demote yourself" });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw createError({ status: 404, message: "User not found" });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      verified: true,
    },
  });

  return updated;
});
