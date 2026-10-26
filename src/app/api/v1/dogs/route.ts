import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { ok, badRequest, withHandler, toNextResponse } from "@/lib/http";
import {
  createDogSchema,
  listDogsQuerySchema,
  type ListDogsQuery,
} from "@/server/modules/dogs/dogs.schemas";
import { listDogs, createDog } from "@/server/modules/dogs/dogs.service";
import type { ListDogsResult } from "@/server/modules/dogs/dogs.schemas";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const url = new URL(req.url);
    const parsed = listDogsQuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      active: url.searchParams.get("active") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });
    const dogs = await listDogs(parsed);
    return ok(dogs);
  });
  return toNextResponse(result);
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const body = await req.json();
    const parsed = createDogSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const dog = await createDog(parsed.data);
    return ok(dog, 201);
  });
  return toNextResponse(result);
}
