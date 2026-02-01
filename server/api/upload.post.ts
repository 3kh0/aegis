import { randomUUID } from "crypto";
import { MAX_SIZE, extFor } from "../utils/fileTypes";

export default defineEventHandler(async (event) => {
  const s = await requireUserSession(event);
  const f = (await readFormData(event)).get("file") as File | null;

  if (!f) throw createError({ status: 400, message: "No file provided" });
  if (f.size > MAX_SIZE) throw createError({ status: 400, message: "File exceeds 10MB limit" });

  const e = extFor(f.type);
  if (!e) throw createError({ status: 400, message: "File type not allowed" });

  const url = await r2upload(Buffer.from(await f.arrayBuffer()), `uploads/${s.user.id}/${randomUUID()}.${e}`, f.type);
  return { url };
});
