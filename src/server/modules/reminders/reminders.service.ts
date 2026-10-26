import { prisma } from "@/server/db";
import { startOfDaySP, endOfDaySP, tomorrowSP } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import {
  sendTextMessage,
  sendTemplateMessage,
} from "@/server/whatsapp/client";

type AppointmentWithRelations = {
  id: string;
  scheduledAt: Date;
  durationMin: number;
  price: unknown;
  taxidogPrice: unknown;
  notes: string | null;
  contactPhone: string;
  whatsappReminderSentAt: Date | null;
  whatsappReminderAttempts: number;
  dog: { name: string; tutorName: string; tutorPhone: string };
  service: { name: string };
};

/**
 * Monta o texto do lembrete a partir de um template e do agendamento.
 * Variáveis suportadas no previewContent: {cão}, {servico}, {data}, {hora}, {preço}.
 */
export function buildReminderText(
  template: { previewContent: string },
  appointment: AppointmentWithRelations
): string {
  const scheduledAt = appointment.scheduledAt;
  const dateStr = scheduledAt.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = scheduledAt.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });

  return template.previewContent
    .replaceAll("{cão}", appointment.dog.name)
    .replaceAll("{cao}", appointment.dog.name)
    .replaceAll("{servico}", appointment.service.name)
    .replaceAll("{data}", dateStr)
    .replaceAll("{hora}", timeStr)
    .replaceAll("{preço}", formatBRL(appointment.price as never))
    .replaceAll("{preco}", formatBRL(appointment.price as never))
    .replaceAll("{tutor}", appointment.dog.tutorName);
}

/**
 * Busca agendamentos de amanhã elegíveis a lembrete.
 */
export async function getUpcomingAppointments(): Promise<AppointmentWithRelations[]> {
  const tomorrowStart = startOfDaySP(tomorrowSP());
  const tomorrowEnd = endOfDaySP(tomorrowSP());

  return prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: tomorrowStart, lte: tomorrowEnd },
      status: { in: ["SCHEDULED", "CONFIRMED"] },
      whatsappReminderSentAt: null,
    },
    include: { dog: true, service: true },
    orderBy: { scheduledAt: "asc" },
  });
}

export type ReminderResult = {
  appointmentId: string;
  success: boolean;
  metaMessageId?: string;
  error?: string;
};

/**
 * Envia lembretes para todos os agendamentos elegíveis de amanhã.
 * Registra cada tentativa em WhatsappLog e atualiza contadores no Appointment.
 */
export async function sendTomorrowReminders(): Promise<ReminderResult[]> {
  const appointments = await getUpcomingAppointments();

  // Buscar template ativo (se existir)
  const template = await prisma.messageTemplate.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  const results: ReminderResult[] = [];

  for (const appointment of appointments) {
    const recipient = appointment.contactPhone || appointment.dog.tutorPhone;
    const text = buildReminderText(
      template ?? {
        previewContent:
          "Olá {tutor}! Lembrete: {cão} tem {servico} amanhã ({data}) às {hora}.",
      },
      appointment
    );

    try {
      const result = await sendTextMessage(recipient, text);

      await prisma.whatsappLog.create({
        data: {
          appointmentId: appointment.id,
          direction: "OUTBOUND",
          status: "SENT",
          metaMessageId: result.metaMessageId,
        },
      });

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          whatsappReminderSentAt: new Date(),
          whatsappReminderAttempts: { increment: 1 },
        },
      });

      results.push({
        appointmentId: appointment.id,
        success: true,
        metaMessageId: result.metaMessageId,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      await prisma.whatsappLog.create({
        data: {
          appointmentId: appointment.id,
          direction: "OUTBOUND",
          status: "FAILED",
          error: errorMsg,
        },
      });

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          whatsappReminderAttempts: { increment: 1 },
        },
      });

      results.push({
        appointmentId: appointment.id,
        success: false,
        error: errorMsg,
      });
    }
  }

  return results;
}
