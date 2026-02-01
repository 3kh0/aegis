export { MAX_SIZE, ACCEPT, EXTS, EXT_MIME, MIME_EXT, MIMES, IMG_EXTS, VID_EXTS, ext, isImg, isVid, mimeOk, mime, extFor, fmtSize, icon } from "~~/shared/fileTypes";

export function assertSafe(p: string): void {
  if (p.includes("..") || p.includes("\\") || p.startsWith("/") || p.includes("\0")) {
    throw createError({ status: 400, message: "Invalid path" });
  }
}
