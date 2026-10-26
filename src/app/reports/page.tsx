import { api } from "@/lib/api";

type Earnings = {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  completedRevenue: number;
};

type ServiceRow = {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
};

type ScheduleRow = {
  date: string;
  total: number;
  done: number;
  revenue: number;
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [earnings, services, schedule] = await Promise.all([
    api.get("/reports/earnings").catch(() => null),
    api.get("/reports/services").catch(() => null),
    api.get("/reports/schedule-load").catch(() => null),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Faturamento</h2>
          <p className="text-2xl font-bold">{formatBRL(earnings?.totalRevenue ?? 0)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {earnings?.completedAppointments ?? 0} concluídos de {earnings?.totalAppointments ?? 0}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Por serviço</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 text-sm font-semibold text-gray-600">Serviço</th>
              <th className="pb-2 text-sm font-semibold text-gray-600 text-right">Qtd</th>
              <th className="pb-2 text-sm font-semibold text-gray-600 text-right">Receita</th>
            </tr>
          </thead>
          <tbody>
            {(services as ServiceRow[] | null)?.length ? (
              (services as ServiceRow[]).map((s: ServiceRow) => (
                <tr key={s.serviceId} className="border-b border-gray-50">
                  <td className="py-2 text-sm">{s.serviceName}</td>
                  <td className="py-2 text-sm text-right">{s.count}</td>
                  <td className="py-2 text-sm text-right">{formatBRL(s.revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                  Sem dados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Carga de horários por dia</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 text-sm font-semibold text-gray-600">Data</th>
              <th className="pb-2 text-sm font-semibold text-gray-600 text-right">Total</th>
              <th className="pb-2 text-sm font-semibold text-gray-600 text-right">Concluídos</th>
              <th className="pb-2 text-sm font-semibold text-gray-600 text-right">Receita</th>
            </tr>
          </thead>
          <tbody>
            {(schedule as ScheduleRow[] | null)?.length ? (
              (schedule as ScheduleRow[]).map((s: ScheduleRow) => (
                <tr key={s.date} className="border-b border-gray-50">
                  <td className="py-2 text-sm">{s.date}</td>
                  <td className="py-2 text-sm text-right">{s.total}</td>
                  <td className="py-2 text-sm text-right">{s.done}</td>
                  <td className="py-2 text-sm text-right">{formatBRL(s.revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                  Sem dados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
