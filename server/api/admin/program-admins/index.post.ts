import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

const schema = z.object({
  emailOrUsername: z.string().min(1),
  programId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const body = await readBody(event);
  const { emailOrUsername, programId } = schema.parse(body);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });

  if (!user) {
    throw createError({ status: 404, message: "User not found" });
  }

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program) {
    throw createError({ status: 404, message: "Program not found" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "PROGRAM_ADMIN" },
  });

  const assignment = await prisma.programMember.upsert({
    where: { userId_programId: { userId: user.id, programId } },
    create: { userId: user.id, programId },
    update: {},
    include: {
      user: { select: { id: true, email: true, username: true } },
      program: { select: { id: true, title: true } },
    },
  });

  return {
    id: assignment.user.id,
    email: assignment.user.email,
    username: assignment.user.username,
    program: assignment.program,
  };
});
