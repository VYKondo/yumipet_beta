"use client";

export function NewAppointmentForm({
  dogs,
  services,
}: {
  dogs: any[];
  services: any[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form className="space-y-4">
        <div>
          <label htmlFor="dogId" className="block text-sm font-medium text-gray-700">
            Cão
          </label>
          <select
            id="dogId"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          >
            <option value="">Selecione um cão</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
            Serviço
          </label>
          <select
            id="serviceId"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
            Data e hora
          </label>
          <input
            id="scheduledAt"
            required
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="durationMin" className="block text-sm font-medium text-gray-700">
              Duração (min)
            </label>
            <input
              id="durationMin"
              type="number"
              min="1"
              defaultValue="30"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Preço (R$)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          >
            <option value="SCHEDULED">Agendado</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="DONE">Concluído</option>
            <option value="CANCELED">Cancelado</option>
            <option value="NO_SHOW">Não compareceu</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="notes"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
            Telefone de contato
          </label>
          <input
            id="contactPhone"
            type="tel"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#791286] focus:outline-none focus:ring-1 focus:ring-[#791286]"
          />
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
