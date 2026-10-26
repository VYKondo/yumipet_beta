import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type Settings = {
  businessName: string;
  phone: string | null;
  timezone: string;
};

export default async function SettingsPage() {
  const settings = (await api.get("/settings").catch(() => null)) as Settings | null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      <form
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4 max-w-md"
        action={async (formData: FormData) => {
          "use server";
          await api.put("/settings", {
            businessName: formData.get("businessName"),
            phone: formData.get("phone") || undefined,
            timezone: formData.get("timezone") || "America/Sao_Paulo",
          });
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do negócio</label>
          <input
            name="businessName"
            defaultValue={settings?.businessName ?? ""}
            className="mt-1 block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-[#791286] outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            name="phone"
            defaultValue={settings?.phone ?? ""}
            className="mt-1 block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-[#791286] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fuso horário</label>
          <input
            name="timezone"
            defaultValue={settings?.timezone ?? "America/Sao_Paulo"}
            className="mt-1 block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-[#791286] outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a0f75] transition"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
