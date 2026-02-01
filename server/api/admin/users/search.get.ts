import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

const schema = z.object({
  q: z.string().min(1).max(100),
});

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const { q } = schema.parse(getQuery(event));
  const term = q.trim().toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      OR: [{ email: { contains: term, mode: "insensitive" } }, { username: { contains: term, mode: "insensitive" } }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      verified: true,
      blockedUntil: true,
      blockReason: true,
      createdAt: true,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return users;
});
