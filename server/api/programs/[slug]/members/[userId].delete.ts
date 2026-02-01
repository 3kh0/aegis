import { prisma } from "../../../../../prisma/db";
import { requireParam, requireProgram, requireProgramAccess } from "../../../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const userId = requireParam(event, "userId");
  const p = await requireProgram(slug);

  await prisma.programMember.deleteMany({
    where: { userId, programId: p.id },
  });

  const r = await prisma.programMember.count({ where: { userId } });
  let demoted = false;
  if (r === 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
    demoted = true;
  }

  return { ok: true, demoted };
});
