import { prisma } from "@/server/db";
import Link from "next/link";
import { AppointmentEditForm } from "./form";

export const instant = false;

export default async function AppointmentEditPage({
  params,
}: {
  params: { id: string };
}) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
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
        <h1 className="text-2xl font-bold text-gray-900">Editar atendimento</h1>
        <Link href="/appointments" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <AppointmentEditForm appointment={appointment} />
    </div>
  );
}
