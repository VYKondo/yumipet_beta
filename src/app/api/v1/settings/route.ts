import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireUser();
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  await requireUser();
  const body = await req.json();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      businessName: body.businessName,
      phone: body.phone,
      timezone: body.timezone,
    },
    create: {
      id: "singleton",
      businessName: body.businessName,
      phone: body.phone,
      timezone: body.timezone,
    },
  });
  return NextResponse.json(settings);
}
