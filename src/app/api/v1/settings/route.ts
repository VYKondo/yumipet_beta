import { requireUser } from "@/server/auth";
import { ok, badRequest, withHandler, toNextResponse } from "@/lib/http";
import { settingsSchema } from "@/server/modules/settings/settings.schemas";
import { getSettings, updateSettings } from "@/server/modules/settings/settings.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const settings = await getSettings();
    return ok(settings);
  });
  return toNextResponse(result);
}

export async function PUT(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const settings = await updateSettings(parsed.data);
    return ok(settings);
  });
  return toNextResponse(result);
}
