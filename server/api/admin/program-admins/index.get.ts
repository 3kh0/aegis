import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const admins = await prisma.user.findMany({
    where: { role: "PROGRAM_ADMIN" },
    select: {
      id: true,
      email: true,
      username: true,
      programs: {
        include: {
          program: { select: { id: true, title: true } },
        },
      },
    },
    orderBy: { email: "asc" },
  });

  return admins.map((u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    programs: u.programs.map((a) => a.program),
  }));
});
