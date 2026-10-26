import { prisma } from "@/server/db";
import type { SettingsInput } from "./settings.schemas";

export async function getSettings() {
  return prisma.settings.findUnique({ where: { id: "singleton" } });
}

export async function updateSettings(input: SettingsInput) {
  const data: any = {};
  if (input.businessName !== undefined) data.businessName = input.businessName;
  if (input.phone !== undefined) data.phone = input.phone ?? null;
  if (input.timezone !== undefined) data.timezone = input.timezone;

  return prisma.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
}
