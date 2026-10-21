import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const service = await prisma.service.findUnique({ where: { id: (await params).id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const body = await req.json();
  const service = await prisma.service.update({
    where: { id: (await params).id },
    data: {
      name: body.name,
      basePrice: body.basePrice,
      defaultDurationMin: body.defaultDurationMin,
      active: body.active,
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  await prisma.service.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
