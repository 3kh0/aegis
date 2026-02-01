import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { requireParam, requireProgramAccess, requireProgram } from "../../../utils/api";

const query = z.object({
  status: z.string().optional(),
  severity: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["newest", "oldest", "severity"]).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const program = await requireProgram(slug, { select: { id: true } });

  const params = query.parse(getQuery(event));
  const page = params.page ?? 1;
  const limit = params.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { programId: program.id };

  if (params.status) {
    where.status = params.status;
  }
  if (params.severity) {
    where.severity = params.severity;
  }
  if (params.q) {
    where.title = { contains: params.q, mode: "insensitive" };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (params.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (params.sort === "severity") {
    orderBy = { severity: "desc" };
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        severity: true,
        createdAt: true,
        submittedBy: { select: { username: true, verified: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
});
