import Link from "next/link";
import { NewServiceForm } from "./form";

export const instant = false;

export default async function NewServicePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo serviço</h1>
        <Link href="/services" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <NewServiceForm />
    </div>
  );
}
