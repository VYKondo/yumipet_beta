import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";

export const instant = false;

export default async function AppointmentDeletePage({
  params,
}: {
  params: { id: string };
}) {
  await requireUser();

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { dog: true, service: true },
  });

  if (!appointment) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Atendimento não encontrado</h1>
        <Link href="/appointments" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Excluir atendimento</h1>
      <p className="text-gray-600">
        Tem certeza que deseja excluir o atendimento de "{appointment.dog.name}"?
      </p>
      <form action="" method="POST" className="space-y-3">
        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Confirmar exclusão
        </button>
        <Link
          href="/appointments"
          className="block text-center text-sm text-[#791286] hover:underline"
        >
          Cancelar
        </Link>
      </form>
    </div>
  );
}
