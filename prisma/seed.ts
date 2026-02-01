import { PrismaClient } from "./generated/client";

const db = new PrismaClient();

const programs = [
  {
    slug: "security",
    title: "Aegis",
    description: "The very platform you are on!",
    iconUrl: "https://aegis.3kh0.net/favicon.png",
    website: "https://aegis.3kh0.net",
    content: null,
  },
];

for (const p of programs)
  await db.program.upsert({ where: { slug: p.slug }, update: {}, create: p });

console.log("Seeded default programs");
await db.$disconnect();
