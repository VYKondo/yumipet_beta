"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createDogAction } from "./actions";

export function NewDogForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createDogAction({
        name: formData.get("name") as string,
        breed: (formData.get("breed") as string) || undefined,
        tutorName: formData.get("tutorName") as string,
        tutorPhone: formData.get("tutorPhone") as string,
        active: formData.get("active") === "on",
      });
      router.push("/dogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o cão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
              Raça
            </label>
            <input
              id="breed"
              name="breed"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700">
              Nome do tutor
            </label>
            <input
              id="tutorName"
              name="tutorName"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
          <div>
            <label htmlFor="tutorPhone" className="block text-sm font-medium text-gray-700">
              Telefone do tutor
            </label>
            <input
              id="tutorPhone"
              name="tutorPhone"
              required
              type="tel"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="active" name="active" type="checkbox" defaultChecked className="rounded border-gray-300 text-[#791286] focus:ring-[#791286]" />
          <label htmlFor="active" className="text-sm text-gray-700">
            Ativo
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
