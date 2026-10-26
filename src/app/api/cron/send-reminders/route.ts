import { NextResponse } from "next/server";
import { withHandler, unauthorized, ok, toNextResponse } from "@/lib/http";
import { env } from "@/lib/env.server";
import { sendTomorrowReminders } from "@/server/modules/reminders/reminders.service";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return toNextResponse(unauthorized("Unauthorized"));
  }

  const result = await withHandler(async () => {
    const results = await sendTomorrowReminders();
    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    return ok({ sent, failed, total: results.length, results });
  });
  return toNextResponse(result);
}
