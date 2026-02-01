import crypto from "node:crypto";
import { prisma } from "../../prisma/db";

const EXPIRY_MIN = 5;
const MAX_ATTEMPTS = 3;

function hash(code: string): string {
  const { sessionPassword } = useRuntimeConfig();
  if (!sessionPassword) throw new Error("NUXT_SESSION_PASSWORD is missing");
  return crypto.createHmac("sha256", sessionPassword).update(code).digest("hex");
}

function compare(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

async function isValid(otp): Promise<boolean> {
  const expired = otp.expiresAt <= new Date() || otp.failedAttempts >= MAX_ATTEMPTS;
  if (expired) await prisma.otp.delete({ where: { id: otp.id } });
  return !expired && !otp.consumedAt;
}

export function generateOTP(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function storeOTP(email: string, code: string): Promise<string> {
  const e = email.toLowerCase();
  const token = crypto.randomBytes(32).toString("base64url");

  await prisma.otp.deleteMany({ where: { email: e, consumedAt: null } });
  await prisma.otp.create({
    data: {
      email: e,
      codeHash: hash(code),
      magicToken: token,
      expiresAt: new Date(Date.now() + EXPIRY_MIN * 60 * 1000),
    },
  });

  return token;
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const o = await prisma.otp.findFirst({
    where: { email: email.toLowerCase(), consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!o || !(await isValid(o))) return false;

  if (!compare(o.codeHash, hash(code))) {
    const attempts = o.failedAttempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await prisma.otp.delete({ where: { id: o.id } });
    } else {
      await prisma.otp.update({ where: { id: o.id }, data: { failedAttempts: attempts } });
    }
    return false;
  }

  await prisma.otp.update({ where: { id: o.id }, data: { consumedAt: new Date() } });
  return true;
}

export async function verifyToken(token: string): Promise<string | null> {
  const o = await prisma.otp.findUnique({ where: { magicToken: token } });
  if (!o || !(await isValid(o))) return null;

  await prisma.otp.update({ where: { id: o.id }, data: { consumedAt: new Date() } });
  return o.email;
}
