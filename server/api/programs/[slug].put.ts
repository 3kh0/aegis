import { prisma } from "../../../prisma/db";
import { requireProgramAccess, requireParam, parseBody, requireProgram, reqSlugUnique } from "../../utils/api";
import { programSchema } from "../../utils/schemas";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  await requireProgram(slug);

  const data = await parseBody(event, programSchema);
  await reqSlugUnique(data.slug, slug);

  const p = await prisma.program.update({
    where: { slug },
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
