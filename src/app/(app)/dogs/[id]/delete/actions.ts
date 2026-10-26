"use server";

import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { revalidatePath } from "next/cache";

export async function deleteDogAction(id: string) {
  await requireUser();
  const existing = await prisma.dog.findUnique({ where: { id } });
  if (!existing) throw new Error("Cão não encontrado");
  await prisma.dog.delete({ where: { id } });
  revalidatePath("/dogs");
}
