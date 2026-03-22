import { prisma } from "../../../../prisma/db";
import { requireParam, requireProgramAccess } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const program = await prisma.program.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: { select: { id: true, email: true, username: true } },
        },
      },
    },
  });
  if (!program) throw createError({ status: 404, message: "Program not found" });

  return program.members.map((member) => ({
    id: member.user.id,
    email: member.user.email,
    username: member.user.username,
    joinedAt: member.createdAt,
  }));
});
