import { assertSafe, mime, ext } from "../../utils/fileTypes";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const p = getRouterParam(event, "path");
  if (!p) throw createError({ status: 400, message: "Missing path" });

  assertSafe(p);

  try {
    const data = await r2get(`uploads/${p}`);
    setHeader(event, "Content-Type", mime(ext(p)));
    setHeader(event, "X-Content-Type-Options", "nosniff");
    setHeader(event, "Content-Disposition", "attachment");
    setHeader(event, "Cache-Control", "private, max-age=3600");
    return data;
  } catch {
    throw createError({ status: 404, message: "File not found" });
  }
});
