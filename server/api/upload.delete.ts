import { z } from "zod";
import { assertSafe } from "../utils/fileTypes";

const schema = z.object({ key: z.string().min(1) });

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const { key } = await readValidatedBody(event, schema.parse);
  const p = key.startsWith("/api/files/") ? `uploads/${key.replace("/api/files/", "")}` : key;

  assertSafe(p);
  if (!p.startsWith(`uploads/${s.user.id}/`)) throw createError({ status: 403, message: "Forbidden" });

  await r2delete(p);
  return { success: true };
});
