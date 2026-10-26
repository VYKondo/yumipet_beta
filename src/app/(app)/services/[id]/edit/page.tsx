import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
        <PageHeader title="Serviço não encontrado" description="" />
        <EmptyState
          title="Serviço não encontrado"
          description="O serviço solicitado não existe ou foi removido."
          action={{ href: "/services", label: "Voltar para a lista" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Editar serviço"
        description={`Atualize os dados de ${service.name}`}
        action={{ href: `/services/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Editar serviço</CardTitle>
          <CardDescription>
            Altere as informações abaixo e salve as alterações.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={`/services/${id}/edit`} method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do serviço
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={service.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)
                </label>
                <input
                  id="price"
                  name="price"
                  defaultValue={String(service.basePrice)}
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Salvar alterações</Button>
              <Link href={`/services/${id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
