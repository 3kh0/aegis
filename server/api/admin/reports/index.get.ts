import { z } from "zod";
import { prisma } from "../../../../prisma/db";
import { requireGlobalAdmin } from "../../../utils/api";

const query = z.object({
  status: z.string().optional(),
  severity: z.string().optional(),
  program: z.string().optional(),
  reporter: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["newest", "oldest", "severity"]).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event);

  const params = query.parse(getQuery(event));
  const page = params.page ?? 1;
  const limit = params.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params.status) {
    where.status = params.status;
  }
  if (params.severity) {
    where.severity = params.severity;
  }
  if (params.program) {
    where.programId = params.program;
  }
  if (params.reporter) {
    where.submittedById = params.reporter;
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
      include: {
        submittedBy: { select: { email: true, username: true, verified: true } },
        program: { select: { slug: true, title: true } },
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
