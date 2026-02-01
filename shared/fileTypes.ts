export const MAX_SIZE = 10 * 1024 * 1024;

export const EXT_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  json: "application/json",
  xml: "application/xml",
};

export const EXTS = Object.keys(EXT_MIME);
export const IMG_EXTS = ["png", "jpg", "jpeg", "gif", "webp"];
export const VID_EXTS = ["mp4", "webm", "mov"];
export const ACCEPT = EXTS.map((e) => `.${e}`).join(",");
export const MIME_EXT = Object.fromEntries(Object.entries(EXT_MIME).map(([e, m]) => [m, e])) as Record<string, string>;
export const MIMES = new Set(Object.values(EXT_MIME));

export const ext = (url: string) => url.split(".").pop()?.toLowerCase() || "";
export const isImg = (url: string) => IMG_EXTS.includes(ext(url));
export const isVid = (url: string) => VID_EXTS.includes(ext(url));
export const mimeOk = (m: string) => MIMES.has(m.split(";")[0].trim());
export const mime = (e?: string) => EXT_MIME[e?.toLowerCase() || ""] || "application/octet-stream";
export const extFor = (m: string) => MIME_EXT[m.split(";")[0].trim()];

export function fmtSize(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function icon(url: string): string {
  const e = ext(url);
  if (IMG_EXTS.includes(e)) return "tabler:photo";
  if (VID_EXTS.includes(e)) return "tabler:video";
  if (e === "pdf") return "tabler:file-type-pdf";
  if (["md", "txt"].includes(e)) return "tabler:file-text";
  if (["json", "xml"].includes(e)) return "tabler:file-code";
  return "tabler:file";
}

export function assertSafe(p: string): void {
  if (p.includes("..") || p.includes("\\") || p.startsWith("/") || p.includes("\0")) {
    throw new Error("Invalid path");
  }
}
