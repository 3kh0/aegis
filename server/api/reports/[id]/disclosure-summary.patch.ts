import { getUser, requireParam, parseBody } from "../../../utils/api";
import { getReportWithAccessCheck, isGlobalAdmin } from "../../../utils/permissions";
import { disclosureSummarySchema } from "../../../utils/schemas";
import { setDisclosureSummary } from "../../../utils/reports";

export default defineEventHandler(async (event) => {
  const u = await getUser(event);
  const id = requireParam(event, "id");
  const body = await parseBody(event, disclosureSummarySchema);

  const result = await getReportWithAccessCheck(id, u.id, u.role);
  if (!result) throw createError({ status: 404, message: "Report not found" });

  const { report, access } = result;
  if (report.disclosureType !== "SUMMARIZED") throw createError({ status: 400, message: "Report is not in summarized disclosure mode" });

  const isOwner = report.submittedById === u.id;
  const isAdmin = access.isProgramAdmin || isGlobalAdmin(u.role);
  if (!isOwner && !isAdmin) throw createError({ status: 403, message: "Forbidden" });

  const field = isOwner ? "reporterSummary" : "adminSummary";
  await setDisclosureSummary(id, field, body.summary);
  return { success: true };
});
