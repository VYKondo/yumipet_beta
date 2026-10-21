import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await requireUser();
  const template = await prisma.messageTemplate.findUnique({ where: { id: "default" } });
  return NextResponse.json(template);
}

export async function PUT(req: Request) {
  await requireUser();
  const body = await req.json();
  const template = await prisma.messageTemplate.upsert({
    where: { id: "default" },
    update: {
      name: body.name,
      metaTemplateName: body.metaTemplateName,
      languageCode: body.languageCode,
      variableOrder: body.variableOrder,
      previewContent: body.previewContent,
    },
    create: {
      id: "default",
      name: body.name,
      metaTemplateName: body.metaTemplateName,
      languageCode: body.languageCode,
      variableOrder: body.variableOrder,
      previewContent: body.previewContent,
    },
  });
  return NextResponse.json(template);
}
