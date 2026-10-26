import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function EditDogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const dog = await prisma.dog.findUnique({
    where: { id },
  });

  if (!dog) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
        <PageHeader title="Cão não encontrado" description="" />
        <EmptyState
          title="Cão não encontrado"
          description="O cão solicitado não existe ou foi removido."
          action={{ href: "/dogs", label: "Voltar para a lista" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Editar cão"
        description={`Atualize os dados de ${dog.name}`}
        action={{ href: `/dogs/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Editar cadastro</CardTitle>
          <CardDescription>
            Altere as informações abaixo e salve as alterações.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={`/dogs/${id}/edit`} method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={dog.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                  Raça
                </label>
                <input
                  id="breed"
                  name="breed"
                  defaultValue={dog.breed ?? ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do tutor
                </label>
                <input
                  id="tutorName"
                  name="tutorName"
                  defaultValue={dog.tutorName}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="tutorPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do tutor
                </label>
                <input
                  id="tutorPhone"
                  name="tutorPhone"
                  defaultValue={dog.tutorPhone}
                  required
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  defaultValue=""
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Salvar alterações</Button>
              <Link href={`/dogs/${id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
