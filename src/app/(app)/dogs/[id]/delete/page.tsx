import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DeleteDogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const dog = await prisma.dog.findUnique({
    where: { id },
    include: { _count: { select: { appointments: true } } },
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
        title="Excluir cão"
        description="Tem certeza de que deseja excluir este cão?"
        action={{ href: `/dogs/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Confirmação de exclusão</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              O cão <strong>{dog.name}</strong> será removido permanentemente.
            </p>
            {dog._count.appointments > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                Este cão possui <strong>{dog._count.appointments}</strong>
                atendimento(s) vinculado(s). Ao excluí-lo, os atendimentos
                associados também serão removidos.
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <form action={`/dogs/${id}/delete`} method="post">
              <Button type="submit" variant="destructive">
                Sim, excluir cão
              </Button>
            </form>
            <Link href={`/dogs/${id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
