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
      <header className="bg-[#791286] px-4 py-3 shadow-md">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white">
            PetShop Manager
          </Link>
          <div className="flex gap-3 text-sm text-white/90">
            <Link href="/appointments" className="hover:text-white">
              Agenda
            </Link>
            <Link href="/dogs" className="hover:text-white">
              Cães
            </Link>
            <Link href="/services" className="hover:text-white">
              Serviços
            </Link>
            <Link href="/reports" className="hover:text-white">
              Relatórios
            </Link>
            <Link href="/settings" className="hover:text-white">
              Config
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 bg-gray-50 p-4">{children}</main>
    </div>
  );
}
