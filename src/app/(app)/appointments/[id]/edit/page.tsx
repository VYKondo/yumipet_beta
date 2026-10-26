import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;

  const [appointment, dogs, services] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id },
      include: { dog: true },
    }),
    prisma.dog.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

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
        title="Editar atendimento"
        description={`Atualize os dados do atendimento de ${appointment.dog.name}`}
        action={{ href: `/appointments/${id}`, label: "Voltar para o detalhe" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Editar atendimento</CardTitle>
          <CardDescription>
            Altere as informações abaixo e salve as alterações.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={`/appointments/${id}/edit`} method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="dogId" className="block text-sm font-medium text-gray-700 mb-1">
                  Cão
                </label>
                <select
                  id="dogId"
                  name="dogId"
                  required
                  defaultValue={appointment.dogId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name} ({dog.tutorName})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  required
                  defaultValue={appointment.serviceId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Data e hora
                </label>
                <input
                  id="scheduledAt"
                  name="scheduledAt"
                  required
                  type="datetime-local"
                  defaultValue={new Date(appointment.scheduledAt).toISOString().slice(0, 16)}
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
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={String(appointment.price)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={appointment.notes ?? ""}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Salvar alterações</Button>
              <Link href={`/appointments/${id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
