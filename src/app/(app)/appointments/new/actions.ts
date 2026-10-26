"use server";

import { requireUser } from "@/server/auth";
import { createAppointment } from "@/server/modules/appointments/appointments.service";
import type { CreateAppointmentInput } from "@/server/modules/appointments/appointments.schemas";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(data: CreateAppointmentInput) {
  await requireUser();
  await createAppointment(data);
  revalidatePath("/appointments");
}
