import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireUser();
  const dogs = await prisma.dog.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(dogs);
}

export async function POST(req: Request) {
  await requireUser();
  const body = await req.json();
  const dog = await prisma.dog.create({
    data: {
      name: body.name,
      breed: body.breed || null,
      tutorName: body.tutorName,
      tutorPhone: body.tutorPhone,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(dog, { status: 201 });
}
