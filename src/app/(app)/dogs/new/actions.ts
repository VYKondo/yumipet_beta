"use server";

import { requireUser } from "@/server/auth";
import { createDog } from "@/server/modules/dogs/dogs.service";
import type { CreateDogInput } from "@/server/modules/dogs/dogs.schemas";

export async function createDogAction(data: CreateDogInput) {
  await requireUser();
  await createDog(data);
}
