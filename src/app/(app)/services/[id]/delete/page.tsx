import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";

export const instant = false;

export default async function ServiceDeletePage({
  params,
}: {
  params: { id: string };
}) {
  await requireUser();

  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { _count: { select: { appointments: true } } },
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
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Excluir serviço</h1>
      <p className="text-gray-600">
        Tem certeza que deseja excluir o serviço "{service.name}"?
      </p>
      {service._count.appointments > 0 && (
        <p className="text-sm text-red-600">
          Este serviço possui {service._count.appointments} atendimento(s) vinculado(s).
        </p>
      )}
      <form action="" method="POST" className="space-y-3">
        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Confirmar exclusão
        </button>
        <Link
          href="/services"
          className="block text-center text-sm text-[#791286] hover:underline"
        >
          Cancelar
        </Link>
      </form>
    </div>
  );
}
