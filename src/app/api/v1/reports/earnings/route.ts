import { requireUser } from "@/server/auth";
import { ok, withHandler, toNextResponse } from "@/lib/http";
import { reportsQuerySchema } from "@/server/modules/reports/reports.schemas";
import { getEarnings } from "@/server/modules/reports/reports.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const url = new URL(req.url);
    const parsed = reportsQuerySchema.parse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
    });
    const data = await getEarnings(parsed);
    return ok(data);
  });
  return toNextResponse(result);
}
