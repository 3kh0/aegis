import type { H3Event } from "h3";

export function getBaseUrl(event?: H3Event): string {
  if (event) {
    const proto = getRequestProtocol(event);
    const host = getRequestHost(event);
    return `${proto}://${host}`;
  }
  return useRuntimeConfig().siteUrl || "http://localhost:3000";
}
