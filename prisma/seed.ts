import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const demoPlan = await prisma.plan.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {
      name: "Demonstração",
      priceInCents: 0,
      tokensQuantity: 1000,
    },
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Demonstração",
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
