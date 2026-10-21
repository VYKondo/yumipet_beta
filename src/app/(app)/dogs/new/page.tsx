import Link from "next/link";
import { NewDogForm } from "./form";

export const instant = false;

export default async function NewDogPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo cão</h1>
        <Link href="/dogs" className="text-[#791286] hover:underline">
          Voltar
        </Link>
      </div>

      <NewDogForm />
    </div>
  );
}
