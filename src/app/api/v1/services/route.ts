import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { ok, badRequest, withHandler, toNextResponse } from "@/lib/http";
import {
  createServiceSchema,
  listServicesQuerySchema,
} from "@/server/modules/services/services.schemas";
import type { ListServicesResult } from "@/server/modules/services/services.schemas";
import {
  listServices,
  createService,
} from "@/server/modules/services/services.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const url = new URL(req.url);
    const parsed = listServicesQuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      active: url.searchParams.get("active") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });
    const services = await listServices(parsed);
    return ok(services);
  });
  return toNextResponse(result);
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const body = await req.json();
    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const service = await createService(parsed.data);
    return ok(service, 201);
  });
  return toNextResponse(result);
}
