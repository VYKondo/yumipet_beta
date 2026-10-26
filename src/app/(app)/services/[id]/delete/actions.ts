"use server";

import { requireUser } from "@/server/auth";
import { deleteService } from "@/server/modules/services/services.service";
import { revalidatePath } from "next/cache";

export async function deleteServiceAction(id: string) {
  await requireUser();
  await deleteService(id);
  revalidatePath("/services");
}
