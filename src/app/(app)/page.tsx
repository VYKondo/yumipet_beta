import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import { startOfDaySP, endOfDaySP, tomorrowSP } from "@/lib/dates";

export default async function DashboardPage() {
  await requireUser();

  const todayStart = startOfDaySP(new Date());
  const todayEnd = endOfDaySP(new Date());
  const tomorrowStart = startOfDaySP(tomorrowSP());
  const tomorrowEnd = endOfDaySP(tomorrowSP());

  const [todayAppointments, tomorrowAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["SCHEDULED", "CONFIRMED", "DONE"] },
      },
      include: { dog: true, service: true },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: tomorrowStart, lte: tomorrowEnd },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: { dog: true, service: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-[#791286]">Hoje</h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhum atendimento hoje.</p>
        ) : (
          <ul className="space-y-2">
            {todayAppointments.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{a.dog.name}</span>
                  <span className="text-sm text-gray-600">
                    {a.scheduledAt.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{a.service.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-[#FFBA00]">Amanhã</h2>
        {tomorrowAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhum atendimento amanhã.</p>
        ) : (
          <ul className="space-y-2">
            {tomorrowAppointments.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{a.dog.name}</span>
                  <span className="text-sm text-gray-600">
                    {a.scheduledAt.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{a.service.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
