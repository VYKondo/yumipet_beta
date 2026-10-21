import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { DogEditForm } from "./form";

export const instant = false;

export default async function DogEditPage({
  params,
}: {
  params: { id: string };
}) {
  const dog = await prisma.dog.findUnique({
    where: { id: params.id },
  });

  if (!dog) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Cão não encontrado</h1>
        <Link href="/dogs" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar cão</h1>
        <Link href="/dogs" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <DogEditForm dog={dog} />
    </div>
  );
}
