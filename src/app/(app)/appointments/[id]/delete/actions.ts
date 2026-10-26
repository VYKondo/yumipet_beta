"use server";

import { requireUser } from "@/server/auth";
import { deleteAppointment } from "@/server/modules/appointments/appointments.service";
import { revalidatePath } from "next/cache";

export async function deleteAppointmentAction(id: string) {
  await requireUser();
  await deleteAppointment(id);
  revalidatePath("/appointments");
}
