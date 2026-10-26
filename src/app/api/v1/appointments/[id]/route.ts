import { requireUser } from "@/server/auth";
import { ok, badRequest, notFound, withHandler, toNextResponse } from "@/lib/http";
import { updateAppointmentSchema } from "@/server/modules/appointments/appointments.schemas";
import {
  getAppointment,
  updateAppointment,
  cancelAppointment,
} from "@/server/modules/appointments/appointments.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const appointment = await getAppointment(id);
    if (!appointment) return notFound("Agendamento não encontrado");
    return ok(appointment);
  });
  return toNextResponse(result);
}

export async function PATCH(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const appointment = await updateAppointment(id, parsed.data);
    return ok(appointment);
  });
  return toNextResponse(result);
}

export async function DELETE(req: Request, { params }: Params) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const { id } = await params;
    const appointment = await cancelAppointment(id);
    return ok(appointment);
  });
  return toNextResponse(result);
}
