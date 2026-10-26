import Link from "next/link";
import { requireUser } from "@/server/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand-primary px-4 py-3 shadow-md">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <img src="/logo.jpg" alt="PetShop Manager" className="h-8 w-8 rounded-md" />
            PetShop Manager
          </Link>
          <div className="flex gap-3 text-sm text-white/90">
            <Link href="/appointments" className="hover:text-brand-secondary">
              Agenda
            </Link>
            <Link href="/dogs" className="hover:text-brand-secondary">
              Cães
            </Link>
            <Link href="/services" className="hover:text-brand-secondary">
              Serviços
            </Link>
            <Link href="/reports" className="hover:text-brand-secondary">
              Relatórios
            </Link>
            <Link href="/settings" className="hover:text-brand-secondary">
              Config
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 bg-gray-50 p-4">{children}</main>
    </div>
  );
}
