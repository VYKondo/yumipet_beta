import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    active?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  await requireUser();

  const sp = await searchParams;
  const search = sp.search ?? undefined;
  const active = sp.active ?? undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(sp.pageSize) || 20));

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { tutorName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (active !== undefined) {
    where.active = active === "true";
  }

  const [dogs, total] = await Promise.all([
    prisma.dog.findMany({
      where,
      include: { _count: { select: { appointments: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.dog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const queryString = (params: Record<string, string>) => {
    const keys = new URLSearchParams();
    if (search) keys.set("search", search);
    if (active !== undefined) keys.set("active", active);
    keys.set("pageSize", String(pageSize));
    Object.entries(params).forEach(([k, v]) => keys.set(k, v));
    return keys.toString();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Cães"
        description="Gerencie os cadastros de cães do petshop"
        action={{ href: "/dogs/new", label: "Novo cão" }}
      />

      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
        <form
          action=""
          method="get"
          className="flex flex-col sm:flex-row gap-2 w-full"
        >
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Buscar cão ou tutor"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
          />
          <select
            name="active"
            defaultValue={active ?? ""}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
          >
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark whitespace-nowrap"
          >
            Filtrar
          </button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          {dogs.length === 0 ? (
            <EmptyState
              title="Nenhum cão encontrado"
              description="Não há cães cadastrados com os filtros informados."
              action={{ href: "/dogs/new", label: "Cadastrar cão" }}
            />
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-medium text-gray-700">Nome</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Raça</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Tutor</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Telefone</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-right">Atendimentos</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dogs.map((dog) => (
                  <tr key={dog.id}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dogs/${dog.id}`}
                        className="font-medium text-brand-primary hover:underline"
                      >
                        {dog.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {dog.breed ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{dog.tutorName}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{dog.tutorPhone}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={dog.active ? "done" : "canceled"}>
                        {dog.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {dog._count.appointments}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dogs/${dog.id}/edit`}
                        className="text-sm text-brand-primary hover:underline mr-2"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-gray-600">
            Exibindo {((page - 1) * pageSize + 1).toLocaleString()} a{" "}
            {Math.min(page * pageSize, total).toLocaleString()} de{" "}
            {total.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/dogs?${queryString({ page: String(Math.max(page - 1, 1)) })}`}
              className={`px-3 py-1.5 rounded border text-brand-primary ${
                page === 1
                  ? "border-gray-200 text-gray-400"
                  : "border-brand-primary hover:bg-brand-primary hover:text-white"
              }`}
            >
              Anterior
            </Link>
            <span className="px-3 py-1.5 rounded border border-gray-200 text-gray-700">
              Página {page} de {totalPages}
            </span>
            <Link
              href={`/dogs?${queryString({ page: String(page + 1) })}`}
              className={`px-3 py-1.5 rounded border text-brand-primary ${
                page === totalPages
                  ? "border-gray-200 text-gray-400"
                  : "border-brand-primary hover:bg-brand-primary hover:text-white"
              }`}
            >
              Próxima
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
