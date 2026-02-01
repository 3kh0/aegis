import { z } from "zod";
import { setProgram } from "../../../utils/reports";
import { isGlobalAdmin } from "../../../utils/permissions";
import { getUser, requireParam, parseBody } from "../../../utils/api";

const schema = z.object({
  programId: z.string().uuid().nullable(),
});

export default defineEventHandler(async (event) => {
  const id = requireParam(event, "id");
  const u = await getUser(event);

  if (!isGlobalAdmin(u.role)) {
    throw createError({ status: 403, message: "no perms lol" });
  }

  const data = await parseBody(event, schema);
  return setProgram(id, data.programId, u.id);
});
