import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

export const instant = false;

export default async function AppointmentViewPage({
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Atendimento</h1>
        <div className="flex gap-2">
          <Link
            href={`/appointments/${appointment.id}/edit`}
            className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
          >
            Editar
          </Link>
          <Link
            href="/appointments"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700 w-1/3">
                Cão
              </td>
              <td className="px-4 py-3">{appointment.dog.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700">
                Serviço
              </td>
              <td className="px-4 py-3">{appointment.service.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700">
                Data e hora
              </td>
              <td className="px-4 py-3">
                {new Date(appointment.scheduledAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700">
                Duração
              </td>
              <td className="px-4 py-3">{appointment.durationMin} min</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700">
                Preço
              </td>
              <td className="px-4 py-3">{formatBRL(appointment.price)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700">
                Status
              </td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 rounded-full border text-[#791286] border-[#791286]">
                  {appointment.status}
                </span>
              </td>
            </tr>
            {appointment.notes && (
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">
                  Observações
                </td>
                <td className="px-4 py-3">{appointment.notes}</td>
              </tr>
            )}
            {appointment.contactPhone && (
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">
                  Telefone
                </td>
                <td className="px-4 py-3">{appointment.contactPhone}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
