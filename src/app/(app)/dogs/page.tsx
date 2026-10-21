import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";

export const instant = false;

export default async function DogsPage() {
  await requireUser();

  const dogs = await prisma.dog.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cães</h1>
        <Link
          href="/dogs/new"
          className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
        >
          Novo cão
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-700">Nome</th>
              <th className="px-4 py-3 font-medium text-gray-700">Raça</th>
              <th className="px-4 py-3 font-medium text-gray-700">Tutor</th>
              <th className="px-4 py-3 font-medium text-gray-700">Telefone</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">
                Atendimentos
              </th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhum cão cadastrado.
                </td>
              </tr>
            ) : (
              dogs.map((dog) => (
                <tr key={dog.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dogs/${dog.id}`}
                      className="font-medium text-[#791286] hover:underline"
                    >
                      {dog.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {dog.breed ?? "—"}
                  </td>
                  <td className="px-4 py-3">{dog.tutorName}</td>
                  <td className="px-4 py-3 text-gray-600">{dog.tutorPhone}</td>
                  <td className="px-4 py-3 text-right">
                    {dog._count.appointments}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dogs/${dog.id}/edit`}
                      className="text-sm text-[#791286] hover:underline mr-2"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/dogs/${dog.id}/delete`}
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
