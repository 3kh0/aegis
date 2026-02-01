import { getUserPrograms, isProgramAdmin } from "../../../utils/permissions";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { id, role } = session.user;

  if (!isProgramAdmin(role)) {
    return [];
  }

  return getUserPrograms(id, role);
});
