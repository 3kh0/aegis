import { prisma } from "../../../prisma/db";
import { requireParam } from "../../utils/api";

export default defineEventHandler(async (event) => {
  const username = requireParam(event, "username");

  const u = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      verified: true,
      description: true,
      website: true,
      github: true,
      publicEmail: true,
      createdAt: true,
      _count: { select: { reports: true } },
    },
  });

  if (!u) {
    throw createError({ status: 404, message: "User not found" });
  }

  const [resolved, reports] = await Promise.all([
    prisma.report.count({
      where: {
        submittedById: u.id,
        status: { in: ["RESOLVED", "INFORMATIVE"] },
      },
    }),
    prisma.report.findMany({
      where: { submittedById: u.id },
      select: {
        status: true,
        program: { select: { id: true, slug: true, title: true, iconUrl: true } },
      },
    }),
  ]);

  const programMap = new Map<string, { title: string; slug: string; icon: string | null; total: number; valid: number }>();

  for (const r of reports) {
    const key = r.program?.id ?? "other";
    const title = r.program?.title ?? "Other";
    const icon = r.program?.iconUrl ?? null;
    const slug = r.program?.slug ?? "other";
    const valid = ["RESOLVED", "INFORMATIVE"].includes(r.status) ? 1 : 0;

    const cur = programMap.get(key);
    if (cur) {
      cur.total++;
      cur.valid += valid;
    } else {
      programMap.set(key, { title, icon, slug, total: 1, valid });
    }
  }

  const programs = Array.from(programMap.values()).map((v) => ({
    slug: v.slug,
    title: v.title,
    icon: v.icon,
    total: v.total,
    valid: v.valid,
  }));

  return {
    user: {
      username: u.username,
      verified: u.verified,
      description: u.description,
      website: u.website,
      github: u.github,
      publicEmail: u.publicEmail,
      createdAt: u.createdAt,
    },
    stats: {
      total: u._count.reports,
      resolved,
      programCount: programs.length,
    },
    programs,
  };
});
