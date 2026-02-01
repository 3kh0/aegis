import { z } from "zod";
import { Severity, ReportStatus } from "../../prisma/db";

export const programSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  iconUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1).max(500),
  website: z.string().url().optional().or(z.literal("")),
  content: z.string().optional(),
});

export const fileInfoSchema = z.object({
  url: z.string(),
  name: z.string(),
  size: z.number(),
});

export const reportSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(10000),
  severity: z.nativeEnum(Severity),
  programId: z.string().uuid().optional().or(z.literal("")),
  vulnType: z.string().max(100).optional().or(z.literal("")),
  affectedAsset: z.string().max(200).optional().or(z.literal("")),
  assetUrl: z.string().max(500).optional().or(z.literal("")),
  impact: z.string().max(5000).optional().or(z.literal("")),
  attachments: z.array(fileInfoSchema).optional(),
  isUnlisted: z.boolean().optional(),
  targetName: z.string().max(200).optional().or(z.literal("")),
  targetUrl: z.string().max(500).optional().or(z.literal("")),
});

export const commentSchema = z.object({
  type: z.literal("COMMENT"),
  content: z.string().min(1).max(5000),
});

export const statusSchema = z.object({
  type: z.literal("STATUS_CHANGED"),
  value: z.nativeEnum(ReportStatus),
});

export const severitySchema = z.object({
  type: z.literal("SEVERITY_CHANGED"),
  value: z.nativeEnum(Severity),
});

export const titleSchema = z.object({
  type: z.literal("TITLE_CHANGED"),
  value: z.string().min(5).max(200),
});

export const activitySchema = z.discriminatedUnion("type", [commentSchema, statusSchema, severitySchema, titleSchema]);

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export const emailSchema = z.object({
  email: z.string().email(),
});

export const authorSchema = z.object({
  emailOrUsername: z.string().min(1),
});

export const otpSchema = z
  .object({
    email: z.string().email().optional(),
    code: z.string().length(6).optional(),
    token: z.string().optional(),
  })
  .refine((data) => (data.email && data.code) || data.token, {
    message: "Either email+code or token is required",
  });

export const profileSchema = z.object({
  description: z.string().max(300).optional(),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().max(39).optional(),
  publicEmail: z.string().email().optional().or(z.literal("")),
});
