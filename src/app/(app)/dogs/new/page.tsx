import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewDogPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Novo cão"
        description="Cadastre um novo cão no petshop"
        action={{ href: "/dogs", label: "Voltar para a lista" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de cão</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para cadastrar um novo cão.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action="/dogs/new" method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Cadastrar cão</Button>
              <Link href="/dogs">
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
