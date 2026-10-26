import { prisma } from "@/server/db";
import { requireUser } from "@/server/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireUser();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [dogsCount, servicesCount, appointmentsCount, todayAppointments] =
    await Promise.all([
      prisma.dog.count(),
      prisma.service.count(),
      prisma.appointment.count(),
      prisma.appointment.findMany({
        where: {
          scheduledAt: { gte: todayStart, lte: todayEnd },
          status: { in: ["SCHEDULED", "CONFIRMED", "DONE"] },
        },
        include: { dog: true, service: true },
        orderBy: { scheduledAt: "asc" },
        take: 5,
      }),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumo dos principais indicadores do petshop"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-normal">Total de cães</CardTitle>
            <CardDescription className="text-xs">{dogsCount}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dogs" className="text-brand-primary text-sm hover:underline font-medium">
              Ver cães →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-normal">Serviços cadastrados</CardTitle>
            <CardDescription className="text-xs">{servicesCount}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/services" className="text-brand-primary text-sm hover:underline font-medium">
              Ver serviços →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-normal">Total de atendimentos</CardTitle>
            <CardDescription className="text-xs">{appointmentsCount}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/appointments" className="text-brand-primary text-sm hover:underline font-medium">
              Ver agenda →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-normal">Atendimentos hoje</CardTitle>
            <CardDescription className="text-xs">{todayAppointments.length}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/appointments?from=today" className="text-brand-primary text-sm hover:underline font-medium">
              Ver detalhes →
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atendimentos de hoje</CardTitle>
          <CardDescription>
            {todayAppointments.length === 0
              ? "Nenhum atendimento agendado para hoje."
              : "Próximos atendimentos programados para hoje."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 bg-white p-1">
            {todayAppointments.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Sem atendimentos agendados para hoje.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {todayAppointments.map((a) => (
                  <li key={a.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{a.dog.name}</p>
                      <p className="text-xs text-gray-500">{a.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">
                        {a.scheduledAt.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <Badge variant="scheduled" className="mt-1">
                        {a.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
