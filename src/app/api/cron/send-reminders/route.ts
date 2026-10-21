import { prisma } from "@/server/db";
import { NextResponse } from "next/server";
import { startOfDaySP, endOfDaySP, tomorrowSP } from "@/lib/dates";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrowStart = startOfDaySP(tomorrowSP());
  const tomorrowEnd = endOfDaySP(tomorrowSP());

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: tomorrowStart, lte: tomorrowEnd },
      status: { in: ["SCHEDULED", "CONFIRMED"] },
    },
    include: { dog: true, service: true },
  });

  for (const appointment of appointments) {
    // WhatsApp reminder sending would go here
    await prisma.whatsappLog.create({
      data: {
        appointmentId: appointment.id,
        direction: "OUTBOUND",
        status: "SENT",
      },
    });
  }

  return NextResponse.json({ sent: appointments.length });
}
