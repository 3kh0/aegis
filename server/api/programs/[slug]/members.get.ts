import { requireParam, requireProgram, requireProgramAccess } from "../../../utils/api";

export default defineEventHandler(async (event) => {
  const slug = requireParam(event, "slug");
  await requireProgramAccess(event, slug);
  const p = await requireProgram(slug, {
    include: {
      members: {
        include: {
          user: { select: { id: true, email: true, username: true } },
        },
      },
    },
  });

  return p.members.map((m) => ({
    id: m.user.id,
    email: m.user.email,
    username: m.user.username,
    joinedAt: m.createdAt,
  }));
});
