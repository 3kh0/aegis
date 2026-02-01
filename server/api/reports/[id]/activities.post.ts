import { addComment, setStatus, setSeverity, setTitle } from "../../../utils/reports";
import { getReportWithAccessCheck } from "../../../utils/permissions";
import { getUser, requireParam, parseBody } from "../../../utils/api";
import { activitySchema } from "../../../utils/schemas";

export default defineEventHandler(async (event) => {
  const id = requireParam(event, "id");
  const u = await getUser(event);
  const data = await parseBody(event, activitySchema);

  const result = await getReportWithAccessCheck(id, u.id, u.role);

  if (!result) {
    throw createError({ status: 404, message: "Report not found" });
  }

  const { access } = result;

  if (!access.canViewDetails) {
    throw createError({ status: 403, message: "Access denied" });
  }

  if (data.type === "COMMENT") {
    return addComment({ content: data.content, reportId: id, authorId: u.id });
  }

  if (data.type === "STATUS_CHANGED") {
    if (!access.canChangeStatus) {
      throw createError({ status: 403, message: "You cannot change the status of this report" });
    }
    await setStatus(id, data.value, u.id);
    return { success: true };
  }

  if (data.type === "SEVERITY_CHANGED") {
    if (!access.canChangeSeverity) {
      throw createError({ status: 403, message: "You cannot change the severity of this report" });
    }
    await setSeverity(id, data.value, u.id);
    return { success: true };
  }

  if (data.type === "TITLE_CHANGED") {
    if (!access.canViewDetails) {
      throw createError({ status: 403, message: "You cannot change the title of this report" });
    }
    await setTitle(id, data.value, u.id);
    return { success: true };
  }
});
