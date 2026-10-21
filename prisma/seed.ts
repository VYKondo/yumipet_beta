import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      businessName: "Meu PetShop",
    },
  });

  await prisma.messageTemplate.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Confirmação padrão",
      metaTemplateName: "confirmacao_atendimento",
      languageCode: "pt_BR",
      variableOrder: ["tutor_name", "dog_name", "service_name", "date", "time"],
      previewContent:
        "Olá {{1}}! Lembramos que o {{2}} tem {{3}} agendado para {{4}} às {{5}}.",
    },
  });

  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      { name: "Banho", basePrice: 45.00, defaultDurationMin: 30 },
      { name: "Tosa", basePrice: 60.00, defaultDurationMin: 45 },
      { name: "Banho e Tosa", basePrice: 90.00, defaultDurationMin: 75 },
      { name: "Consulta Veterinária", basePrice: 120.00, defaultDurationMin: 30 },
    ],
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
