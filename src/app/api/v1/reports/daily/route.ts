import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";
import { startOfDaySP, endOfDaySP } from "@/lib/dates";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const targetDate = date ? new Date(date) : new Date();

  const dayStart = startOfDaySP(targetDate);
  const dayEnd = endOfDaySP(targetDate);

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: dayStart, lte: dayEnd },
    },
    include: { dog: true, service: true },
    orderBy: { scheduledAt: "asc" },
  });

  const total = appointments.reduce((sum, a) => sum + Number(a.price), 0);
  const done = appointments.filter((a) => a.status === "DONE");
  const doneTotal = done.reduce((sum, a) => sum + Number(a.price), 0);

  return NextResponse.json({
    date: targetDate.toISOString().split("T")[0],
    totalAppointments: appointments.length,
    totalRevenue: total,
    completedAppointments: done.length,
    completedRevenue: doneTotal,
    appointments,
  });
}
