import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatBRL } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  SCHEDULED: "scheduled",
  DONE: "done",
  CANCELED: "canceled",
} as const;

export default async function AppointmentDetailPage({
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Atendimento"
        description="Detalhes do atendimento agendado"
        action={{ href: "/appointments", label: "Voltar para a agenda" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações do atendimento</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Cão</p>
            <Link href={`/dogs/${appointment.dogId}`} className="text-brand-primary hover:underline font-medium">
              {appointment.dog.name}
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Tutor</p>
            <p className="text-lg font-medium text-gray-900">{appointment.dog.tutorName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Serviço</p>
            <p className="text-lg font-medium text-gray-900">{appointment.service.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Data e hora</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(appointment.scheduledAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status</p>
            <Badge
              variant={STATUS_VARIANT[appointment.status as keyof typeof STATUS_VARIANT] ?? "default"}
            >
              {appointment.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Preço</p>
            <p className="text-lg font-medium text-gray-900">{formatBRL(appointment.price)}</p>
          </div>
          {appointment.notes && (
            <div className="space-y-2 md:col-span-2">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Observações</p>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-3">
        <Link href={`/appointments/${id}/edit`}>
          <Button>Editar atendimento</Button>
        </Link>
        <Link href="/appointments" className="ml-auto">
          <Button variant="outline">Voltar para a agenda</Button>
        </Link>
      </div>
    </div>
  );
}
