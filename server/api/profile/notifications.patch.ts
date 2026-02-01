import { z } from "zod";
import { prisma } from "../../../prisma/db";
import { getUser, parseBody } from "../../utils/api";
import { notifications } from "../../notifications/config";

const schema = z.object({ type: z.string(), channel: z.string(), enabled: z.boolean() });

export default defineEventHandler(async (event) => {
  const { id } = await getUser(event);
  const { type, channel, enabled } = await parseBody(event, schema);

  if (!notifications[type]) throw createError({ status: 400, message: "Invalid notification type" });

  await prisma.notificationPreference.upsert({
    where: { userId_type_channel: { userId: id, type, channel } },
    create: { userId: id, type, channel, enabled },
    update: { enabled },
  });

  return { ok: true };
});
