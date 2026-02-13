import { getUser, requireParam, parseBody } from "../../../utils/api";
import { getReportWithAccessCheck } from "../../../utils/permissions";
import { disclosureSchema } from "../../../utils/schemas";
import { setDisclosure } from "../../../utils/reports";

export default defineEventHandler(async (event) => {
  const u = await getUser(event);
  const id = requireParam(event, "id");
  const body = await parseBody(event, disclosureSchema);

  const result = await getReportWithAccessCheck(id, u.id, u.role);
  if (!result) throw createError({ status: 404, message: "Report not found" });
  if (!result.access.canDisclose) throw createError({ status: 403, message: "Forbidden" });

  await setDisclosure(id, body.type, u.id);
  return { success: true };
});
