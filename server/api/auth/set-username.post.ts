import { prisma } from "../../../prisma/db";
import { parseBody } from "../../utils/api";
import { usernameSchema } from "../../utils/schemas";

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const { username } = await parseBody(event, usernameSchema);

  const [current, taken] = await Promise.all([prisma.user.findUnique({ where: { id: s.user.id } }), prisma.user.findUnique({ where: { username } })]);

  if (current?.username) throw createError({ status: 403, message: "nice try bucko" });
  if (taken && taken.id !== s.user.id) throw createError({ status: 409, message: "Username already taken" });

  const u = await prisma.user.update({ where: { id: s.user.id }, data: { username } });

  await setUserSession(event, { user: { id: u.id, email: u.email, username: u.username, role: u.role } });

  return { success: true };
});
