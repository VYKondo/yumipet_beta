import { requireUser } from "@/server/auth";
import { sendTomorrowReminders, getUpcomingAppointments } from "@/server/modules/reminders/reminders.service";

export const dynamic = "force-dynamic";

type ReminderResult = {
  sent: number;
  failed: number;
  total: number;
  details: Array<{
    appointmentId: string;
    dogName: string;
    tutorPhone: string;
    status: "sent" | "failed";
    error?: string;
  }>;
};

type UpcomingAppointment = {
  id: string;
  scheduledAt: Date;
  dog: { name: string; tutorName: string; tutorPhone: string };
  service: { name: string };
};

export default async function RemindersPage() {
  await requireUser();

  const [upcoming, result] = await Promise.all([
    getUpcomingAppointments().catch(() => [] as UpcomingAppointment[]),
    sendTomorrowReminders().catch(() => null) as Promise<ReminderResult | null>,
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Lembretes</h1>

      {result && (
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Envio automático (amanhã)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Enviados</p>
              <p className="text-2xl font-bold text-green-600">{result.sent}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Falhas</p>
              <p className="text-2xl font-bold text-red-600">{result.failed}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-gray-900">{result.total}</p>
            </div>
          </div>
          {result.details.length > 0 && (
            <table className="mt-4 w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="pb-2 pl-4 text-sm font-semibold text-gray-600">Cão</th>
                  <th className="pb-2 pl-4 text-sm font-semibold text-gray-600">Telefone</th>
                  <th className="pb-2 pl-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.details.map((item) => (
                  <tr key={item.appointmentId} className="border-b border-gray-100 last:border-0">
                    <td className="pb-2 pl-4 text-sm text-gray-700">{item.dogName}</td>
                    <td className="pb-2 pl-4 text-sm text-gray-700">{item.tutorPhone}</td>
                    <td className="pb-2 pl-4 text-sm">
                      {item.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          Enviado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                          Falhou
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Agendamentos para amanhã</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">Não há agendamentos para amanhã.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 pl-4 text-sm font-semibold text-gray-600">Data/Hora</th>
                <th className="pb-3 pl-4 text-sm font-semibold text-gray-600">Cão</th>
                <th className="pb-3 pl-4 text-sm font-semibold text-gray-600">Tutor</th>
                <th className="pb-3 pl-4 text-sm font-semibold text-gray-600">Serviço</th>
                <th className="pb-3 pl-4 text-sm font-semibold text-gray-600">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 last:border-0">
                  <td className="pb-3 pl-4 text-sm text-gray-700">
                    {app.scheduledAt.toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    {" "}
                    {app.scheduledAt.toLocaleTimeString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="pb-3 pl-4 text-sm text-gray-700">{app.dog.name}</td>
                  <td className="pb-3 pl-4 text-sm text-gray-700">{app.dog.tutorName}</td>
                  <td className="pb-3 pl-4 text-sm text-gray-700">{app.service.name}</td>
                  <td className="pb-3 pl-4 text-sm text-gray-700">{app.dog.tutorPhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
