import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

export const instant = false;

export default async function AppointmentsPage() {
  await requireUser();

  const appointments = await prisma.appointment.findMany({
    include: { dog: true, service: true },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <Link
          href="/appointments/new"
          className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
        >
          Novo atendimento
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhum atendimento agendado.
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{new Date(a.scheduledAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                  </td>
                  <td className="px-4 py-3">{a.dog.name}</td>
                  <td className="px-4 py-3">{a.service.name}</td>
                  <td className="px-4 py-3 text-right">{formatBRL(a.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-1 rounded-full border text-[#791286] border-[#791286]">
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/appointments/${a.id}`}
                      className="text-sm text-[#791286] hover:underline mr-2"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/appointments/${a.id}/edit`}
                      className="text-sm text-[#791286] hover:underline mr-2"
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
