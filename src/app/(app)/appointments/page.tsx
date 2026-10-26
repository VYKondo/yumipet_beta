import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

const STATUS_VARIANT = {
  SCHEDULED: "scheduled",
  DONE: "done",
  CANCELED: "canceled",
} as const;
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    status?: string;
    dogId?: string;
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  await requireUser();

  const sp = await searchParams;
  const from = sp.from ?? undefined;
  const to = sp.to ?? undefined;
  const status = sp.status ?? undefined;
  const dogId = sp.dogId ?? undefined;
  const search = sp.search ?? undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(sp.pageSize) || 20));

  const where: Record<string, unknown> = {};
  const scheduledAtFilter: Record<string, unknown> = {};
  if (from) scheduledAtFilter.gte = new Date(from);
  if (to) scheduledAtFilter.lte = new Date(to);
  if (from || to) where.scheduledAt = scheduledAtFilter;
  if (status) where.status = status;
  if (dogId) where.dogId = dogId;
  if (search) {
    where.OR = [
      { dog: { name: { contains: search, mode: "insensitive" } } },
      { dog: { tutorName: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { dog: true, service: true },
      orderBy: { scheduledAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.appointment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const queryString = (params: Record<string, string>) => {
    const keys = new URLSearchParams();
    if (from) keys.set("from", from);
    if (to) keys.set("to", to);
    if (status) keys.set("status", status);
    if (dogId) keys.set("dogId", dogId);
    if (search) keys.set("search", search);
    keys.set("pageSize", String(pageSize));
    Object.entries(params).forEach(([k, v]) => keys.set(k, v));
    return keys.toString();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Agenda"
        description="Gerencie os atendimentos do petshop"
        action={{ href: "/appointments/new", label: "Novo atendimento" }}
      />

      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
        <form
          action=""
          method="get"
          className="flex flex-col sm:flex-row gap-2 w-full"
        >
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Buscar cão ou tutor"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
          />
          <select
            name="status"
            defaultValue={status ?? ""}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
          >
            <option value="">Todos</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="DONE">Realizado</option>
            <option value="CANCELED">Cancelado</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark whitespace-nowrap"
          >
            Filtrar
          </button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <EmptyState
              title="Nenhum atendimento encontrado"
              description="Não há atendimentos agendados com os filtros informados."
              action={{ href: "/appointments/new", label: "Agendar atendimento" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-medium text-gray-700">Data/Hora</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Cão</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Serviço</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-right">Preço</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {new Date(a.scheduledAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dogs/${a.dogId}`}
                          className="font-medium text-brand-primary hover:underline"
                        >
                          {a.dog.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.service.name}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatBRL(a.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={STATUS_VARIANT[a.status as keyof typeof STATUS_VARIANT] ?? "default"}
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/appointments/${a.id}`}
                          className="text-sm text-brand-primary hover:underline mr-2"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/appointments/${a.id}/edit`}
                          className="text-sm text-brand-primary hover:underline mr-2"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/appointments/${a.id}/delete`}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Excluir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-gray-600">
            Exibindo {((page - 1) * pageSize + 1).toLocaleString()} a{" "}
            {Math.min(page * pageSize, total).toLocaleString()} de{" "}
            {total.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/appointments?${queryString({ page: String(Math.max(page - 1, 1)) })}`}
              className={`px-3 py-1.5 rounded border text-brand-primary ${
                page === 1
                  ? "border-gray-200 text-gray-400"
                  : "border-brand-primary hover:bg-brand-primary hover:text-white"
              }`}
            >
              Anterior
            </Link>
            <span className="px-3 py-1.5 rounded border border-gray-200 text-gray-700">
              Página {page} de {totalPages}
            </span>
            <Link
              href={`/appointments?${queryString({ page: String(page + 1) })}`}
              className={`px-3 py-1.5 rounded border text-brand-primary ${
                page === totalPages
                  ? "border-gray-200 text-gray-400"
                  : "border-brand-primary hover:bg-brand-primary hover:text-white"
              }`}
            >
              Próxima
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
