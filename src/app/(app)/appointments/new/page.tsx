import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function NewAppointmentPage() {
  await requireUser();

  const [dogs, services] = await Promise.all([
    prisma.dog.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  if (dogs.length === 0 || services.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
        <PageHeader title="Novo atendimento" description="Agende um novo atendimento" />
        <EmptyState
          title="Cadastros insuficientes"
          description={
            dogs.length === 0 && services.length === 0
              ? "Cadastre pelo menos um cão e um serviço antes de agendar um atendimento."
              : dogs.length === 0
              ? "Cadastre pelo menos um cão ativo antes de agendar um atendimento."
              : "Cadastre pelo menos um serviço ativo antes de agendar um atendimento."
          }
          action={{
            href: dogs.length === 0 ? "/dogs/new" : "/services/new",
            label: dogs.length === 0 ? "Cadastrar cão" : "Cadastrar serviço",
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Novo atendimento"
        description="Agende um novo atendimento para um cão"
        action={{ href: "/appointments", label: "Voltar para a agenda" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Agendar atendimento</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para agendar um novo atendimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action="/appointments/new" method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="dogId" className="block text-sm font-medium text-gray-700 mb-1">
                  Cão
                </label>
                <select
                  id="dogId"
                  name="dogId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  <option value="">Selecione um cão</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  <option value="">Selecione um serviço</option>
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
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Agendar atendimento</Button>
              <Link href="/appointments">
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
