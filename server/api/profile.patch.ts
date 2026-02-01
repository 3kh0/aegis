import { prisma } from "../../prisma/db";
import { parseBody } from "../utils/api";
import { profileSchema } from "../utils/schemas";

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const body = await parseBody(event, profileSchema);

  const u = await prisma.user.update({
    where: { id: s.user.id },
    data: {
      description: body.description || null,
      website: body.website || null,
      github: body.github || null,
      publicEmail: body.publicEmail || null,
    },
    select: {
      username: true,
      description: true,
      website: true,
      github: true,
      publicEmail: true,
    },
  });

  return u;
});
