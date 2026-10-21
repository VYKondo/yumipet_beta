import { prisma } from "@/server/db";
import Link from "next/link";
import { ServiceEditForm } from "./form";

export const instant = false;

export default async function ServiceEditPage({
  params,
}: {
  params: { id: string };
}) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar serviço</h1>
        <Link href="/services" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <ServiceEditForm service={service} />
    </div>
  );
}
