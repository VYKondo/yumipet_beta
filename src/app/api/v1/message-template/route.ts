import { requireUser } from "@/server/auth";
import { ok, badRequest, withHandler, toNextResponse } from "@/lib/http";
import { messageTemplateSchema } from "@/server/modules/message-template/message-template.schemas";
import { getMessageTemplate, updateMessageTemplate } from "@/server/modules/message-template/message-template.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const template = await getMessageTemplate();
    return ok(template);
  });
  return toNextResponse(result);
}

export async function PUT(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const body = await req.json();
    const parsed = messageTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const template = await updateMessageTemplate(parsed.data);
    return ok(template);
  });
  return toNextResponse(result);
}
