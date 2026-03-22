import { prisma } from "../../../prisma/db";
import { getUser } from "../../utils/api";
import { notifications } from "../../notifications/config";

export default defineEventHandler(async (event) => {
  const { id } = await getUser(event);
  const prefs = await prisma.notificationPreference.findMany({ where: { userId: id } });

  const result: Record<string, Record<string, boolean>> = {};
  for (const t of Object.keys(notifications)) result[t] = { email: true, slack: false };
  for (const p of prefs) {
    const channels = (result[p.type] ??= {});
    channels[p.channel] = p.enabled;
  }

  return result;
});
