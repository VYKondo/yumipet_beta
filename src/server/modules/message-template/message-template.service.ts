import { prisma } from "@/server/db";
import type { MessageTemplateInput } from "./message-template.schemas";

export async function getMessageTemplate() {
  return prisma.messageTemplate.findUnique({ where: { id: "default" } });
}

export async function updateMessageTemplate(input: MessageTemplateInput) {
  return prisma.messageTemplate.upsert({
    where: { id: "default" },
    update: input,
    create: { id: "default", ...input },
  });
}
