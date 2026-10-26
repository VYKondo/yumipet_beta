import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DeleteServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: { _count: { select: { appointments: true } } },
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
        title="Excluir serviço"
        description="Tem certeza de que deseja excluir este serviço?"
        action={{ href: `/services/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Confirmação de exclusão</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              O serviço <strong>{service.name}</strong> será removido permanentemente.
            </p>
            {service._count.appointments > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                Este serviço possui <strong>{service._count.appointments}</strong>
                atendimento(s) vinculado(s). Ao excluí-lo, os atendimentos
                associados também serão removidos.
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <form action={`/services/${id}/delete`} method="post">
              <Button type="submit" variant="destructive">
                Sim, excluir serviço
              </Button>
            </form>
            <Link href={`/services/${id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
