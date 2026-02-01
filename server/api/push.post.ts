export default defineEventHandler(async (e) => {
  const body = await readRawBody(e);
  if (!body) {
    throw createError({ status: 400, message: "Missing envelope" });
  }

  const dsn = useRuntimeConfig().public.sentry.dsn;
  if (!dsn) {
    throw createError({ status: 500, message: "Sentry not setup" });
  }

  const url = new URL(dsn);
  const projectId = url.pathname.replace("/", "");

  const header = body.split("\n")[0];
  let envelope: { dsn?: { host?: string } };
  try {
    envelope = JSON.parse(header);
  } catch {
    throw createError({ status: 400, message: "Invalid envelope" });
  }

  const host = envelope?.dsn?.host || url.host;
  const target = `https://${host}/api/${projectId}/envelope/`;

  const res = await $fetch.raw(target, {
    method: "POST",
    headers: { "Content-Type": "application/x-sentry-envelope" },
    body,
  });

  return { status: res.status };
});
