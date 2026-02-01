import { prisma } from "../../../prisma/db";
import { requireParam } from "../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");

  const p = await prisma.program.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      iconUrl: true,
      description: true,
      website: true,
      content: true,
    },
  });

  if (!p) {
    throw createError({ status: 404, message: "Program not found" });
  }

  const grouped = await prisma.report.groupBy({
    by: ["submittedById"],
    where: { programId: p.id, status: { in: ["RESOLVED", "INFORMATIVE"] } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  let leaders: { rank: number; username: string; count: number; verified: boolean }[] = [];

  if (grouped.length) {
    const users = await prisma.user.findMany({
      where: { id: { in: grouped.map((g) => g.submittedById) } },
      select: { id: true, username: true, verified: true },
    });
    const userMap = new Map(users.map((u) => [u.id, { username: u.username, verified: u.verified }]));
    leaders = grouped.map((g, i) => {
      const u = userMap.get(g.submittedById);
      return {
        rank: i + 1,
        username: u?.username || "Unknown",
        count: g._count.id,
        verified: u?.verified || false,
      };
    });
  }

  return {
    id: p.id,
    title: p.title,
    iconUrl: p.iconUrl,
    description: p.description,
    website: p.website,
    content: p.content,
    leaders,
  };
});
