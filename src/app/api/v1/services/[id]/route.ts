import { requireUser } from "@/server/auth";
import { ok, badRequest, notFound, withHandler, toNextResponse } from "@/lib/http";
import { updateServiceSchema } from "@/server/modules/services/services.schemas";
import {
  getService,
  updateService,
  deactivateService,
} from "@/server/modules/services/services.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const service = await getService(id);
    if (!service) return notFound("Serviço não encontrado");
    return ok(service);
  });
  return toNextResponse(result);
}

export async function PUT(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const existing = await getService(id);
    if (!existing) return notFound("Serviço não encontrado");
    const service = await updateService(id, parsed.data);
    return ok(service);
  });
  return toNextResponse(result);
}

export async function DELETE(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const existing = await getService(id);
    if (!existing) return notFound("Serviço não encontrado");
    const service = await deactivateService(id);
    return ok(service);
  });
  return toNextResponse(result);
}
