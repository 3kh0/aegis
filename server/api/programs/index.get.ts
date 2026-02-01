import { prisma } from "../../../prisma/db";

export default defineEventHandler(async () => {
  const programs = await prisma.program.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      iconUrl: true,
      description: true,
    },
    orderBy: { title: "asc" },
  });

  return programs.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    iconUrl: p.iconUrl,
    description: p.description,
  }));
});
