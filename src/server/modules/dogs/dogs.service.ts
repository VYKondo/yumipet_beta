import { prisma } from "@/server/db";
import type { Prisma, Dog } from "@prisma/client";
import { toE164 } from "@/lib/phone";
import type { CreateDogInput, ListDogsQuery, ListDogsResult, UpdateDogInput } from "./dogs.schemas";

export async function listDogs(query: ListDogsQuery): Promise<ListDogsResult> {
  const where: Prisma.DogWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { tutorName: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.active !== undefined) {
    where.active = query.active;
  }

  const [items, total] = await Promise.all([
    prisma.dog.findMany({
      where,
      orderBy: { name: "asc" },
      skip: ((query.page ?? 1) - 1) * (query.pageSize ?? 20),
      take: query.pageSize ?? 20,
    }),
    prisma.dog.count({ where }),
  ]);

  return { items, total, page: query.page ?? 1, pageSize: query.pageSize ?? 20 };
}

export async function getDog(id: string): Promise<Dog | null> {
  return prisma.dog.findUnique({ where: { id } });
}

export async function createDog(input: CreateDogInput): Promise<Dog> {
  return prisma.dog.create({
    data: {
      name: input.name,
      breed: input.breed ?? null,
      tutorName: input.tutorName,
      tutorPhone: toE164(input.tutorPhone),
      active: input.active ?? true,
    },
  });
}

export async function updateDog(id: string, input: UpdateDogInput): Promise<Dog> {
  return prisma.dog.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.breed !== undefined && { breed: input.breed }),
      ...(input.tutorName !== undefined && { tutorName: input.tutorName }),
      ...(input.tutorPhone !== undefined && { tutorPhone: toE164(input.tutorPhone) }),
      ...(input.active !== undefined && { active: input.active }),
    },
  });
}

export async function archiveDog(id: string): Promise<Dog> {
  return prisma.dog.update({
    where: { id },
    data: { active: false },
  });
}

export async function hasAppointments(dogId: string): Promise<boolean> {
  const count = await prisma.appointment.count({ where: { dogId } });
  return count > 0;
}

export async function deleteDog(id: string): Promise<void> {
  const existing = await prisma.dog.findUnique({ where: { id } });
  if (!existing) throw new Error("Cão não encontrado");

  await prisma.dog.delete({ where: { id } });
}
