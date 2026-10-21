import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const appointment = await prisma.appointment.findUnique({
    where: { id: (await params).id },
    include: { dog: true, service: true },
  });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const body = await req.json();
  const appointment = await prisma.appointment.update({
    where: { id: (await params).id },
    data: {
      dogId: body.dogId,
      serviceId: body.serviceId,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      durationMin: body.durationMin,
      price: body.price,
      status: body.status,
      notes: body.notes || null,
      contactPhone: body.contactPhone || null,
    },
    include: { dog: true, service: true },
  });
  return NextResponse.json(appointment);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  await prisma.appointment.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
