import { createReport } from "../../utils/reports";
import { parseBody } from "../../utils/api";
import { reportSchema } from "../../utils/schemas";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);

  const u = await prisma.user.findUnique({ where: { id: s.user.id }, select: { blockedUntil: true } });
  if (u?.blockedUntil && u.blockedUntil > new Date()) {
    throw createError({ status: 403, message: "You are blocked from submitting reports" });
  }

  const data = await parseBody(event, reportSchema);

  if (data.programId) {
    const program = await prisma.program.findUnique({ where: { id: data.programId } });
    if (!program) throw createError({ status: 404, message: "Program not found" });
  }

  const report = await createReport({
    ...data,
    submittedById: s.user.id,
    programId: data.programId || undefined,
  });

  return { id: report!.id };
});
