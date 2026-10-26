import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function DeleteAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { dog: true, service: true },
  });

  if (!appointment) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
        <PageHeader title="Atendimento não encontrado" description="" />
        <EmptyState
          title="Atendimento não encontrado"
          description="O atendimento solicitado não existe ou foi removido."
          action={{ href: "/appointments", label: "Voltar para a agenda" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Excluir atendimento"
        description="Tem certeza de que deseja excluir este atendimento?"
        action={{ href: `/appointments/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Confirmação de exclusão</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              O atendimento de <strong>{appointment.dog.name}</strong> para o
              serviço <strong>{appointment.service.name}</strong> será removido permanentemente.
            </p>
            <p className="text-sm text-gray-600">
              Data:{" "}
              {new Date(appointment.scheduledAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <form action={`/appointments/${id}/delete`} method="post">
              <Button type="submit" variant="destructive">
                Sim, excluir atendimento
              </Button>
            </form>
            <Link href={`/appointments/${id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
