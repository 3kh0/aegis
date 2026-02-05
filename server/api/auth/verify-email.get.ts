import { verify, sendConfirm } from "../../utils/email-change";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const t = query.t as string;

  if (!t) {
    return sendRedirect(event, "/settings?ec=invalid");
  }

  const result = await verify(t);

  if (!result) {
    return sendRedirect(event, "/settings?ec=expired");
  }

  await Promise.all([sendConfirm(result.oldEmail, true), sendConfirm(result.newEmail, false)]);

  await clearUserSession(event);

  return sendRedirect(event, "/auth/login?ec=true");
});
