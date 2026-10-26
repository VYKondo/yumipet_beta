import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Novo serviço"
        description="Cadastre um novo serviço oferecido pelo petshop"
        action={{ href: "/services", label: "Voltar para a lista" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de serviço</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para cadastrar um novo serviço.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action="/services/new" method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do serviço
                </label>
                <input
                  id="name"
                  name="name"
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
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Cadastrar serviço</Button>
              <Link href="/services">
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
