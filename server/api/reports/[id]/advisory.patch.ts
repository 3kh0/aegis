import { getUser, requireParam, parseBody } from "../../../utils/api";
import { getReportWithAccessCheck } from "../../../utils/permissions";
import { prisma } from "../../../../prisma/db";
import { z } from "zod";

const schema = z.object({
  url: z.string().url().startsWith("https://github.com/").or(z.literal("")),
});

export default defineEventHandler(async (event) => {
  const u = await getUser(event);
  const id = requireParam(event, "id");
  const { url } = await parseBody(event, schema);

  const r = await getReportWithAccessCheck(id, u.id, u.role);
  if (!r) throw createError({ status: 404, message: "Report not found" });
  if (!r.access.canDisclose) throw createError({ status: 403, message: "Forbidden" });

  await prisma.report.update({ where: { id }, data: { githubAdvisory: url || null } });
  return { success: true };
});
