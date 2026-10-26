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

export default async function DogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const dog = await prisma.dog.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { service: true },
        orderBy: { scheduledAt: "desc" },
      },
    },
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title={dog.name}
        description="Detalhes do cadastro do cão"
        action={{ href: "/dogs", label: "Voltar para a lista" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações do cão</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Nome</p>
            <p className="text-lg font-medium text-gray-900">{dog.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Raça</p>
            <p className="text-lg font-medium text-gray-900">{dog.breed ?? "—"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Tutor</p>
            <p className="text-lg font-medium text-gray-900">{dog.tutorName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Telefone</p>
            <p className="text-lg font-medium text-gray-900">{dog.tutorPhone}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status</p>
            <Badge variant={dog.active ? "done" : "canceled"}>
              {dog.active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total de atendimentos</p>
            <p className="text-lg font-medium text-gray-900">{dog.appointments.length}</p>
          </div>
        </CardContent>
      </Card>

      {dog.appointments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Atendimentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-medium text-gray-700">Data/Hora</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Serviço</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-right">Preço</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dog.appointments.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {new Date(a.scheduledAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.service.name}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatBRL(a.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={STATUS_VARIANT[a.status as keyof typeof STATUS_VARIANT] ?? "default"}
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/appointments/${a.id}`}
                          className="text-sm text-brand-primary hover:underline mr-2"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="Nenhum atendimento"
          description="Este cão ainda não possui atendimentos agendados."
          action={{ href: "/appointments/new", label: "Agendar atendimento" }}
        />
      )}
    </div>
  );
}
