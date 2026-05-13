import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const planId = randomUUID();

  const demoPlan = await prisma.plan.upsert({
    where: { id: planId },
    update: {
      name: "DEMO",
      priceInCents: 0,
      tokensQuantity: 1000,
    },
    create: {
      id: planId,
      name: "DEMO",
      priceInCents: 0,
      tokensQuantity: 1000,
    },
  });

  console.log("Plan created/updated:", demoPlan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
