import { prisma } from "../../prisma/db";

export async function upsertEmail(email: string) {
  const e = email.toLowerCase();
  let user = await prisma.user.findUnique({ where: { email: e } });

  if (!user) {
    user = await prisma.user.create({ data: { email: e } });
  }

  return user;
}

export async function upsertHCA(hackClubId: string, email: string) {
  const existingByHackClubId = await prisma.user.findUnique({
    where: { hackClubId },
  });
  if (existingByHackClubId) {
    if (existingByHackClubId.email !== email) {
      return await prisma.user.update({
        where: { id: existingByHackClubId.id },
        data: { email },
      });
    }
    return existingByHackClubId;
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingByEmail) {
    return await prisma.user.update({
      where: { id: existingByEmail.id },
      data: { hackClubId },
    });
  }

  return await prisma.user.create({
    data: { email, hackClubId },
  });
}
