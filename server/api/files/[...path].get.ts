import { assertSafe, mime, ext } from "../../utils/fileTypes";
import { getReportWithAccessCheck } from "../../utils/permissions";
import { prisma } from "../../../prisma/db";
import type { UserRole } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const p = getRouterParam(event, "path");
  if (!p) throw createError({ status: 400, message: "Missing path" });

  assertSafe(p);

  const attachment = await prisma.attachment.findUnique({ where: { path: p } });
  if (!attachment) throw createError({ status: 404, message: "File not found" });

  const report = await prisma.report.findUnique({
    where: { id: attachment.reportId },
    select: { disclosureType: true, id: true },
  });
  if (!report) throw createError({ status: 404, message: "File not found" });

  if (!report.disclosureType) {
    let u: { id: string; role: string } | null = null;
    try {
      const s = await getUserSession(event);
      if (s?.user?.id) {
        const found = await prisma.user.findUnique({ where: { id: s.user.id }, select: { id: true, role: true } });
        if (found) u = found;
      }
    } catch {
      /* no auth */
    }

    if (!u) throw createError({ status: 404, message: "File not found" });

    const result = await getReportWithAccessCheck(report.id, u.id, u.role as UserRole);
    if (!result || !result.access.canView) throw createError({ status: 404, message: "File not found" });
  }

  try {
    const data = await r2get(`uploads/${p}`);
    setHeader(event, "Content-Type", mime(ext(p)));
    setHeader(event, "X-Content-Type-Options", "nosniff");
    setHeader(event, "Content-Disposition", "inline");
    setHeader(event, "Cache-Control", report.disclosureType ? "public, max-age=3600" : "private, max-age=3600");
    return data;
  } catch {
    throw createError({ status: 404, message: "File not found" });
  }
});
