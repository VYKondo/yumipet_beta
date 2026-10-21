import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireUser();
  const appointments = await prisma.appointment.findMany({
    include: { dog: true, service: true },
    orderBy: { scheduledAt: "desc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();
  const appointment = await prisma.appointment.create({
    data: {
      dogId: body.dogId,
      serviceId: body.serviceId,
      scheduledAt: new Date(body.scheduledAt),
      durationMin: body.durationMin,
      price: body.price,
      status: body.status || "SCHEDULED",
      notes: body.notes || null,
      contactPhone: body.contactPhone || null,
    },
    include: { dog: true, service: true },
  });
  return NextResponse.json(appointment, { status: 201 });
}
