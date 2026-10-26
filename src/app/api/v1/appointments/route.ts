import { requireUser } from "@/server/auth";
import { ok, badRequest, withHandler, toNextResponse, AppError } from "@/lib/http";
import {
  createAppointmentSchema,
  listAppointmentsQuerySchema,
} from "@/server/modules/appointments/appointments.schemas";
import {
  listAppointments,
  createAppointment,
} from "@/server/modules/appointments/appointments.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const url = new URL(req.url);
    const parsed = listAppointmentsQuerySchema.parse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      dogId: url.searchParams.get("dogId") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      pageSize: url.searchParams.get("pageSize") ?? undefined,
    });
    const appointments = await listAppointments(parsed);
    return ok(appointments);
  });
  return toNextResponse(result);
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  await requireUser(token);
  const result = await withHandler(async () => {
    const body = await req.json();
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Dados inválidos",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      );
    }
    const appointment = await createAppointment(parsed.data);
    return ok(appointment, 201);
  });
  return toNextResponse(result);
}
