import { prisma } from "@/server/db";
import type { ReportsQuery } from "./reports.schemas";

type AppointmentSummary = {
  id: string;
  scheduledAt: Date;
  price: unknown;
  status: string;
  serviceId: string;
  service: { name: string } | null;
};

async function fetchAppointments(query: ReportsQuery): Promise<AppointmentSummary[]> {
  return prisma.appointment.findMany({
    where: {
      ...(query.from && { scheduledAt: { gte: new Date(query.from) } }),
      ...(query.to && { scheduledAt: { lte: new Date(query.to) } }),
    },
    include: { service: true },
    orderBy: { scheduledAt: "asc" },
  }) as Promise<AppointmentSummary[]>;
}

export async function getEarnings(query: ReportsQuery) {
  const appointments = await fetchAppointments(query);

  const done = appointments.filter((a) => a.status === "DONE");
  const totalRevenue = done.reduce((sum, a) => sum + Number(a.price || 0), 0);

  return {
    totalAppointments: appointments.length,
    completedAppointments: done.length,
    totalRevenue,
    completedRevenue: totalRevenue,
  };
}

export async function getServices(query: ReportsQuery) {
  const appointments = await fetchAppointments(query);

  const byService = new Map<
    string,
    { serviceId: string; serviceName: string; count: number; revenue: number }
  >();

  for (const a of appointments) {
    if (a.status !== "DONE") continue;
    const key = a.serviceId;
    const name = a.service?.name ?? "Serviço";
    const existing = byService.get(key);
    if (existing) {
      existing.count += 1;
      existing.revenue += Number(a.price || 0);
    } else {
      byService.set(key, { serviceId: key, serviceName: name, count: 1, revenue: Number(a.price || 0) });
    }
  }

  return Array.from(byService.values()).sort((a, b) => b.revenue - a.revenue);
}

export async function getScheduleLoad(query: ReportsQuery) {
  const appointments = await fetchAppointments(query);

  const byDay = new Map<
    string,
    { date: string; total: number; done: number; revenue: number }
  >();

  for (const a of appointments) {
    const date = new Date(a.scheduledAt).toISOString().split("T")[0];
    const existing = byDay.get(date) ?? { date, total: 0, done: 0, revenue: 0 };
    existing.total += 1;
    if (a.status === "DONE") {
      existing.done += 1;
      existing.revenue += Number(a.price || 0);
    }
    byDay.set(date, existing);
  }

  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
}
