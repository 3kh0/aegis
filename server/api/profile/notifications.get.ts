import { prisma } from "../../../prisma/db";
import { getUser } from "../../utils/api";
import { notifications } from "../../notifications/config";

export default defineEventHandler(async (event) => {
  const { id } = await getUser(event);
  const prefs = await prisma.notificationPreference.findMany({ where: { userId: id } });

  const result: Record<string, Record<string, boolean>> = {};
  for (const t of Object.keys(notifications)) result[t] = { email: true };
  for (const p of prefs) {
    result[p.type] ??= {};
    result[p.type][p.channel] = p.enabled;
  }

  return result;
});
