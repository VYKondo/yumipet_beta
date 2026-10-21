import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

export const instant = false;

export default async function ServicesPage() {
  await requireUser();

  const services = await prisma.service.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
        <Link
          href="/services/new"
          className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
        >
          Novo serviço
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-700">Nome</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Preço base</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Duração</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-center">Ativo</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Atendimentos</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhum serviço cadastrado.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/services/${service.id}`}
                      className="font-medium text-[#791286] hover:underline"
                    >
                      {service.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">{formatBRL(service.basePrice)}</td>
                  <td className="px-4 py-3 text-right">{service.defaultDurationMin} min</td>
                  <td className="px-4 py-3 text-center">
                    {service.active ? "Sim" : "Não"}
                  </td>
                  <td className="px-4 py-3 text-right">{service._count.appointments}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/services/${service.id}/edit`}
                      className="text-sm text-[#791286] hover:underline mr-2"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/services/${service.id}/delete`}
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
