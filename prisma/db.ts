import { PrismaClient, Severity, ReportStatus, UserRole, ActivityType } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
export { Severity, ReportStatus, UserRole, ActivityType };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
