import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event);
  if (!sess.user?.id) throw createError({ status: 401 });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sess.user.id },
    select: { email: true },
  });

  await prisma.$transaction([
    prisma.notificationPreference.deleteMany({
      where: { userId: sess.user.id },
    }),
    prisma.programMember.deleteMany({
      where: { userId: sess.user.id },
    }),
    prisma.otp.deleteMany({
      where: { email: user.email },
    }),
    prisma.user.update({
      where: { id: sess.user.id },
      data: {
        email: `${sess.user.id}@delet.ed`,
        username: null,
        hackClubId: null,
        slackId: null,
        description: null,
        website: null,
        github: null,
        publicEmail: null,
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailExpiry: null,
        verified: false,
        role: "USER",
        deleted: true,
        deletedAt: new Date(),
      },
    }),
  ]);

  await clearUserSession(event);

  return { ok: true };
});
