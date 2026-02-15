import { z } from "zod";
import { addTriage, canAccessProgram } from "../../../utils/permissions";
import { requireParam, requireAdminFull } from "../../../utils/api";
import { prisma } from "../../../../prisma/db";
import { notify } from "../../../notifications";

export default defineEventHandler(async (event) => {
  const id = requireParam(event, "id");
  z.string().uuid().parse(id);

  const u = await requireAdminFull(event);
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw createError({ status: 404, message: "Report not found" });

  if (report.programId) {
    const canAccess = await canAccessProgram(u.id, report.programId, u.role);
    if (!canAccess) throw createError({ status: 404, message: "Report not found" });
  }

  if (report.submittedById === u.id) {
    throw createError({ status: 400, message: "You are already the owner of this report" });
  }

  const added = await addTriage(id, u.id, u.username || "unknown");
  if (!added) {
    throw createError({ status: 400, message: "You have already joined this report" });
  }

  await prisma.activity.create({
    data: {
      type: "TRIAGE_JOINED",
      reportId: id,
      authorId: u.id,
    },
  });

  notify({
    type: "TRIAGE_JOINED",
    reportId: id,
    actorId: u.id,
  }).catch((err) => console.error("Failed to send triage-joined notification:", err));

  return { success: true };
});
