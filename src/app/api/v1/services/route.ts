import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireUser();
  const services = await prisma.service.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();
  const service = await prisma.service.create({
    data: {
      name: body.name,
      basePrice: body.basePrice,
      defaultDurationMin: body.defaultDurationMin,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(service, { status: 201 });
}
