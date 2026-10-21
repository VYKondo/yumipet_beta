import { prisma } from "@/server/db";
import Link from "next/link";
import { NewAppointmentForm } from "./form";

export const instant = false;

export default async function NewAppointmentPage() {
  const [dogs, services] = await Promise.all([
    prisma.dog.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo atendimento</h1>
        <Link href="/appointments" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <NewAppointmentForm dogs={dogs} services={services} />
    </div>
  );
}
