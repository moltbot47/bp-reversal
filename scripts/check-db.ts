import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.length);
  for (const u of users) {
    console.log(`  - ${u.email} (onboarded: ${u.onboarded})`);
  }
  const sessions = await prisma.session.findMany();
  console.log("Sessions:", sessions.length);
  for (const s of sessions) {
    console.log(`  - user: ${s.userId}, expires: ${s.expires}`);
  }
  const tokens = await prisma.verificationToken.findMany();
  console.log("Verification tokens:", tokens.length);
  await prisma.$disconnect();
}

main().catch(console.error);
