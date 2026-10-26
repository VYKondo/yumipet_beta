import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">PetShop Manager</h1>
      <p className="mt-2 text-zinc-600 max-w-md">Gerencie agendamentos, tutores, serviços, lembretes WhatsApp e relatórios financeiros.</p>
      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/login" className="px-5 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition">
          Entrar
        </Link>
      </div>
    </div>
  );
}
