import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const dog = await prisma.dog.findUnique({ where: { id: (await params).id } });
  if (!dog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(dog);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  const body = await req.json();
  const dog = await prisma.dog.update({
    where: { id: (await params).id },
    data: {
      name: body.name,
      breed: body.breed || null,
      tutorName: body.tutorName,
      tutorPhone: body.tutorPhone,
      active: body.active,
    },
  });
  return NextResponse.json(dog);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireUser();
  await prisma.dog.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
