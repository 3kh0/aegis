import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { requireParam, parseBody, requireProgram, requireProgramAccess, getUserFull } from "../../../utils/api";
import { notify } from "../../../notifications";

const schema = z.object({
  emailOrUsername: z.string().min(1),
  force: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const admin = await getUserFull(event);
  const p = await requireProgram(slug);

  const { emailOrUsername: q, force } = await parseBody(event, schema);

  const emailLower = q.toLowerCase();
  let target = await prisma.user.findFirst({
    where: { OR: [{ email: emailLower }, { username: q }] },
    select: { id: true, email: true, username: true, role: true },
  });

  const isEmail = q.includes("@");

  if (!target) {
    if (!isEmail) {
      throw createError({ status: 404, message: "User not found" });
    }

    if (!force) {
      throw createError({ status: 404, message: "User not found", data: { needsConfirm: true } });
    }

    target = await prisma.user.create({
      data: { email: emailLower, role: "USER" },
    });
  }

  const exists = await prisma.programMember.findUnique({
    where: { userId_programId: { userId: target.id, programId: p.id } },
  });

  if (exists) {
    throw createError({ status: 400, message: "User is already a member" });
  }

  await prisma.programMember.create({
    data: { userId: target.id, programId: p.id },
  });

  notify({
    type: "PROGRAM_INVITE",
    programId: p.id,
    actorId: admin.id,
    userId: target.id,
  }).catch((err) => console.error("Failed to send invite:", err));

  return { ok: true };
});
