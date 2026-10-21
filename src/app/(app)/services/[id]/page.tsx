import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

export const instant = false;

export default async function ServiceViewPage({
  params,
}: {
  params: { id: string };
}) {
  await requireUser();

  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: {
      appointments: {
        include: { dog: true },
        orderBy: { scheduledAt: "desc" },
      },
    },
  });

  if (!service) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Serviço não encontrado</h1>
        <Link href="/services" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/services/${service.id}/edit`}
            className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
          >
            Editar
          </Link>
          <Link
            href="/services"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Informações</h2>
          <p className="text-sm text-gray-600"><strong>Preço base:</strong> {formatBRL(service.basePrice)}</p>
          <p className="text-sm text-gray-600"><strong>Duração padrão:</strong> {service.defaultDurationMin} min</p>
          <p className="text-sm text-gray-600"><strong>Status:</strong> {service.active ? "Ativo" : "Inativo"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-700">
          Atendimentos
        </h2>
        <div className="divide-y divide-gray-100">
          {service.appointments.length === 0 ? (
            <div className="px-4 py-4 text-center text-gray-500">
              Nenhum atendimento.
            </div>
          ) : (
            service.appointments.map((a) => (
              <div key={a.id} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{a.dog.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(a.scheduledAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatBRL(a.price)}</p>
                    <span className="text-xs px-2 py-1 rounded-full border text-[#791286] border-[#791286]">
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
