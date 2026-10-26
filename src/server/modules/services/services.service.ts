import { prisma } from "@/server/db";
import type { Prisma, Service } from "@prisma/client";
import type {
  CreateServiceInput,
  UpdateServiceInput,
  ListServicesQuery,
} from "./services.schemas";

export async function listServices(query: ListServicesQuery): Promise<{
  items: Service[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const where: Prisma.ServiceWhereInput = {};

  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }

  if (query.active !== undefined) {
    where.active = query.active;
  }

  const [items, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { name: "asc" },
      skip: ((query.page ?? 1) - 1) * (query.pageSize ?? 20),
      take: query.pageSize ?? 20,
    }),
    prisma.service.count({ where }),
  ]);

  return { items, total, page: query.page ?? 1, pageSize: query.pageSize ?? 20 };
}

export async function getService(id: string): Promise<Service | null> {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(input: CreateServiceInput): Promise<Service> {
  return prisma.service.create({
    data: {
      name: input.name,
      basePrice: input.basePrice,
      defaultDurationMin: input.defaultDurationMin,
      active: input.active ?? true,
    },
  });
}

export async function updateService(
  id: string,
  input: UpdateServiceInput
): Promise<Service> {
  return prisma.service.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
      ...(input.defaultDurationMin !== undefined && {
        defaultDurationMin: input.defaultDurationMin,
      }),
      ...(input.active !== undefined && { active: input.active }),
    },
  });
}

export async function deactivateService(id: string): Promise<Service> {
  return prisma.service.update({
    where: { id },
    data: { active: false },
  });
}

export async function hasAppointments(serviceId: string): Promise<boolean> {
  const count = await prisma.appointment.count({ where: { serviceId } });
  return count > 0;
}

export async function deleteService(id: string): Promise<void> {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new Error("Serviço não encontrado");

  await prisma.service.delete({ where: { id } });
}
