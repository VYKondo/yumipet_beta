import { requireUser } from "@/server/auth";
import { ok, badRequest, notFound, withHandler, toNextResponse } from "@/lib/http";
import { updateDogSchema } from "@/server/modules/dogs/dogs.schemas";
import {
  getDog,
  updateDog,
  archiveDog,
} from "@/server/modules/dogs/dogs.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const dog = await getDog(id);
    if (!dog) return notFound("Cão não encontrado");
    return ok(dog);
  });
  return toNextResponse(result);
}

export async function PUT(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateDogSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const existing = await getDog(id);
    if (!existing) return notFound("Cão não encontrado");
    const dog = await updateDog(id, parsed.data);
    return ok(dog);
  });
  return toNextResponse(result);
}

export async function DELETE(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const existing = await getDog(id);
    if (!existing) return notFound("Cão não encontrado");
    const dog = await archiveDog(id);
    return ok(dog);
  });
  return toNextResponse(result);
}
