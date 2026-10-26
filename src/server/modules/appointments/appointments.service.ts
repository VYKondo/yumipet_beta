import { prisma } from "@/server/db";
import type { Prisma, Appointment, Dog, Service } from "@prisma/client";
import { toE164 } from "@/lib/phone";
import { AppError } from "@/lib/http";
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  ListAppointmentsQuery,
  ListAppointmentsResult,
} from "./appointments.schemas";

export type AppointmentWithRelations = Appointment & {
  dog: Dog;
  service: Service;
};

const NON_CANCELLABLE_STATUS = ["DONE", "CANCELED"] as const;

/**
 * Detecta sobreposição de horários.
 * Um agendamento ocupa [scheduledAt, scheduledAt + durationMin).
 * Agendamentos CANCELED são ignorados.
 */
async function hasTimeConflict(params: {
  scheduledAt: Date;
  durationMin: number;
  excludeId?: string;
}): Promise<boolean> {
  const { scheduledAt, durationMin, excludeId } = params;
  const start = scheduledAt;
  const end = new Date(scheduledAt.getTime() + durationMin * 60 * 1000);

  // Buscar candidatos que começam antes do fim da janela
  // e filtrar no servidor os que terminam depois do início.
  const candidates = await prisma.appointment.findMany({
    where: {
      status: { not: "CANCELED" },
      ...(excludeId && { id: { not: excludeId } }),
      scheduledAt: { lt: end },
    },
    select: { scheduledAt: true, durationMin: true },
  });

  const overlapping = candidates.some((appt) => {
    const apptStart = appt.scheduledAt;
    const apptEnd = new Date(apptStart.getTime() + appt.durationMin * 60 * 1000);
    return apptStart < end && apptEnd > start;
  });

  return overlapping;
}

export async function listAppointments(
  query: ListAppointmentsQuery
): Promise<ListAppointmentsResult> {
  const where: Prisma.AppointmentWhereInput = {};

  if (query.from || query.to) {
    where.scheduledAt = {};
    if (query.from) where.scheduledAt.gte = new Date(query.from);
    if (query.to) where.scheduledAt.lte = new Date(query.to);
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.dogId) {
    where.dogId = query.dogId;
  }

  if (query.search) {
    where.OR = [
      { dog: { name: { contains: query.search, mode: "insensitive" } } },
      { dog: { tutorName: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { dog: true, service: true },
      orderBy: { scheduledAt: "asc" },
      skip: ((query.page ?? 1) - 1) * (query.pageSize ?? 20),
      take: query.pageSize ?? 20,
    }),
    prisma.appointment.count({ where }),
  ]);

  return { items, total, page: query.page ?? 1, pageSize: query.pageSize ?? 20 };
}

export async function getAppointment(
  id: string
): Promise<AppointmentWithRelations | null> {
  return prisma.appointment.findUnique({
    where: { id },
    include: { dog: true, service: true },
  });
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<AppointmentWithRelations> {
  // 1. Validar que cão e serviço existem e estão ativos
  const [dog, service] = await Promise.all([
    prisma.dog.findUnique({ where: { id: input.dogId } }),
    prisma.service.findUnique({ where: { id: input.serviceId } }),
  ]);

  if (!dog) throw new AppError(400, "Cão não encontrado");
  if (!service) throw new AppError(400, "Serviço não encontrado");
  if (!dog.active) throw new AppError(400, "Cão está inativo");
  if (!service.active) throw new AppError(400, "Serviço está inativo");

  const scheduledAt = new Date(input.scheduledAt);

  // 2. Não permitir agendamento no passado
  const now = new Date();
  if (scheduledAt < now) {
    throw new AppError(400, "Não é possível agendar no passado");
  }

  // 3. Detectar conflito de horário
  const conflict = await hasTimeConflict({
    scheduledAt,
    durationMin: input.durationMin,
  });
  if (conflict) {
    throw new AppError(409, "Horário já ocupado por outro agendamento");
  }

  // 4. Snapshot do telefone do cadastro do cão (se não fornecido)
  const contactPhone = input.contactPhone
    ? toE164(input.contactPhone)
    : dog.tutorPhone;

  // 5. Criar agendamento com snapshots financeiros
  return prisma.appointment.create({
    data: {
      dogId: input.dogId,
      serviceId: input.serviceId,
      scheduledAt,
      durationMin: input.durationMin,
      price: input.price,
      taxidogPrice: input.taxidogPrice,
      notes: input.notes ?? null,
      contactPhone,
      status: input.status ?? "SCHEDULED",
    },
    include: { dog: true, service: true },
  });
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
): Promise<AppointmentWithRelations> {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Agendamento não encontrado");
  if (existing.status === "CANCELED") {
    throw new AppError(400, "Agendamento cancelado não pode ser editado");
  }

  // Se mudar cão ou serviço, validar que estão ativos
  if (input.dogId) {
    const dog = await prisma.dog.findUnique({ where: { id: input.dogId } });
    if (!dog) throw new AppError(400, "Cão não encontrado");
    if (!dog.active) throw new AppError(400, "Cão está inativo");
  }

  if (input.serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: input.serviceId },
    });
    if (!service) throw new AppError(400, "Serviço não encontrado");
    if (!service.active) throw new AppError(400, "Serviço está inativo");
  }

  // Se mudar data/hora, validar passado e conflito
  const newScheduledAt = input.scheduledAt
    ? new Date(input.scheduledAt)
    : existing.scheduledAt;
  const newDurationMin = input.durationMin ?? existing.durationMin;

  if (input.scheduledAt && input.scheduledAt !== undefined) {
    const now = new Date();
    if (newScheduledAt < now) {
      throw new AppError(400, "Não é possível agendar no passado");
    }
  }

  const hasTimeChange = input.scheduledAt !== undefined || input.durationMin !== undefined;
  if (hasTimeChange) {
    const conflict = await hasTimeConflict({
      scheduledAt: newScheduledAt,
      durationMin: newDurationMin,
      excludeId: id,
    });
    if (conflict) {
      throw new AppError(409, "Horário já ocupado por outro agendamento");
    }
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      ...(input.dogId !== undefined && { dogId: input.dogId }),
      ...(input.serviceId !== undefined && { serviceId: input.serviceId }),
      ...(input.scheduledAt !== undefined && {
        scheduledAt: new Date(input.scheduledAt),
      }),
      ...(input.durationMin !== undefined && { durationMin: input.durationMin }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.taxidogPrice !== undefined && { taxidogPrice: input.taxidogPrice }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.contactPhone !== undefined && {
        contactPhone: toE164(input.contactPhone),
      }),
      ...(input.status !== undefined && { status: input.status }),
    },
    include: { dog: true, service: true },
  });
}

export async function cancelAppointment(
  id: string
): Promise<AppointmentWithRelations> {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Agendamento não encontrado");
  if (NON_CANCELLABLE_STATUS.includes(existing.status as (typeof NON_CANCELLABLE_STATUS)[number])) {
    throw new AppError(400, `Agendamento já está com status ${existing.status}`);
  }

  return prisma.appointment.update({
    where: { id },
    data: { status: "CANCELED" },
    include: { dog: true, service: true },
  });
}

export async function updateStatus(
  id: string,
  status: "DONE" | "NO_SHOW" | "CONFIRMED"
): Promise<AppointmentWithRelations> {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Agendamento não encontrado");
  if (existing.status === "CANCELED") {
    throw new AppError(400, "Agendamento cancelado não pode mudar de status");
  }

  return prisma.appointment.update({
    where: { id },
    data: { status },
    include: { dog: true, service: true },
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Agendamento não encontrado");

  await prisma.appointment.delete({ where: { id } });
}
