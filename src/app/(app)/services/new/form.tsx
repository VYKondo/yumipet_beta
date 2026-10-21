"use client";

export function NewServiceForm() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            id="name"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
              Preço base (R$)
            </label>
            <input
              id="basePrice"
              required
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
          <div>
            <label htmlFor="defaultDurationMin" className="block text-sm font-medium text-gray-700">
              Duração padrão (min)
            </label>
            <input
              id="defaultDurationMin"
              required
              type="number"
              min="1"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" defaultChecked className="rounded border-gray-300 text-[#791286] focus:ring-[#791286]" />
          <label htmlFor="active" className="text-sm text-gray-700">
            Ativo
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66]"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
