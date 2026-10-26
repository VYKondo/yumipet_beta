"use server";

import { requireUser } from "@/server/auth";
import { updateDog } from "@/server/modules/dogs/dogs.service";
import { revalidatePath } from "next/cache";

export async function updateDogAction(id: string, data: {
  name: string;
  breed?: string;
  tutorName: string;
  tutorPhone: string;
  active: boolean;
}) {
  await requireUser();
  await updateDog(id, data);
  revalidatePath("/dogs");
  revalidatePath(`/dogs/${id}/edit`);
}
