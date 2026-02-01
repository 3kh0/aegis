import type { H3Event } from "h3";
import type { ZodSchema } from "zod";
import type { UserRole } from "../../prisma/db";
import { prisma } from "../../prisma/db";
import { canAccessProgramBySlug, isAdmin, isProgramAdmin } from "./permissions";

export interface AuthUser {
  id: string;
  role: UserRole;
}

export async function getUser(event: H3Event): Promise<AuthUser> {
  const s = await requireUserSession(event);
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { id: true, role: true },
  });
  if (!u) {
    throw createError({ status: 401, message: "User not found" });
  }
  return u;
}

export async function requireAdmin(event: H3Event): Promise<AuthUser> {
  const u = await getUser(event);
  if (!isAdmin(u.role)) {
    throw createError({ status: 403, message: "Forbidden" });
  }
  return u;
}

export interface FullUser extends AuthUser {
  email: string;
  username: string | null;
}

export async function getUserFull(event: H3Event): Promise<FullUser> {
  const s = await requireUserSession(event);
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { id: true, role: true, email: true, username: true },
  });
  if (!u) {
    throw createError({ status: 401, message: "User not found" });
  }
  return u;
}

export async function requireAdminFull(event: H3Event): Promise<FullUser> {
  const u = await getUserFull(event);
  if (!isAdmin(u.role)) {
    throw createError({ status: 403, message: "Admin access required" });
  }
  return u;
}

export async function requireGlobalAdmin(event: H3Event): Promise<AuthUser> {
  const u = await getUser(event);
  if (u.role !== "GLOBAL_ADMIN") {
    throw createError({ status: 403, message: "Forbidden" });
  }
  return u;
}

export function requireParam(event: H3Event, name: string): string {
  const v = getRouterParam(event, name);
  if (!v) {
    throw createError({ status: 400, message: `${name} is required` });
  }
  return v;
}

export async function parseBody<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
  const body = await readBody(event);
  const r = schema.safeParse(body);
  if (!r.success) {
    throw createError({
      status: 400,
      message: r.error.issues?.[0]?.message || "Invalid request",
    });
  }
  return r.data;
}

export async function requireProgram<T extends Parameters<typeof prisma.program.findUnique>[0]>(slug: string, opts?: Omit<T, "where">) {
  const p = await prisma.program.findUnique({ where: { slug }, ...opts });
  if (!p) {
    throw createError({ status: 404, message: "Program not found" });
  }
  return p;
}

export async function requireReport(id: string) {
  const r = await prisma.report.findUnique({ where: { id } });
  if (!r) {
    throw createError({ status: 404, message: "Report not found" });
  }
  return r;
}

export async function requireProgramAccess(event: H3Event, slug: string): Promise<AuthUser> {
  const s = await requireUserSession(event);
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { id: true, role: true },
  });
  if (!u) {
    throw createError({ status: 401, message: "User not found" });
  }
  if (!isProgramAdmin(u.role)) {
    throw createError({ status: 403, message: "Forbidden" });
  }
  const canAccess = await canAccessProgramBySlug(u.id, slug, u.role);
  if (!canAccess) {
    throw createError({ status: 403, message: "Forbidden" });
  }
  return u;
}

export async function reqSlugUnique(slug: string, currentSlug?: string) {
  if (currentSlug && slug === currentSlug) return;
  const exists = await prisma.program.findUnique({ where: { slug } });
  if (exists) {
    throw createError({ status: 409, message: "A program with this slug already exists" });
  }
}

export function checkTo(url: string | undefined): string {
  if (!url) return "/dashboard";
  if (url.startsWith("//") || url.includes(":")) return "/dashboard";
  if (!url.startsWith("/")) return "/dashboard";
  return url;
}
