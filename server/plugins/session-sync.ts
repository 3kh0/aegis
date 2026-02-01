import { prisma } from "../../prisma/db";

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session, event) => {
    if (!session?.user?.id) return;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user && user.role !== session.user.role) {
      await replaceUserSession(event, {
        ...session,
        user: { ...session.user, role: user.role },
      });
      session.user.role = user.role;
    }
  });
});
