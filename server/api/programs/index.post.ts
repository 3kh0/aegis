import { prisma } from "../../../prisma/db";
import { requireAdmin, parseBody, reqSlugUnique } from "../../utils/api";
import { programSchema } from "../../utils/schemas";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const data = await parseBody(event, programSchema);
  await reqSlugUnique(data.slug);

  const p = await prisma.program.create({
    data: {
      title: data.title,
      slug: data.slug,
      iconUrl: data.iconUrl || null,
      description: data.description,
      website: data.website || null,
      content: data.content || null,
    },
    select: { slug: true },
  });

  return { slug: p.slug };
});
