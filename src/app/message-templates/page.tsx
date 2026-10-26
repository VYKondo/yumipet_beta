import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { requireUser } from "@/server/auth";

export const dynamic = "force-dynamic";

type MessageTemplate = {
  id: string;
  previewContent: string;
};

export default async function MessageTemplatesPage() {
  await requireUser();

  const template = (await api
    .get("/message-template")
    .catch(() => null)) as MessageTemplate | null;

  async function updateTemplate(formData: FormData) {
    "use server";
    const previewContent = formData.get("previewContent") as string;
    await api.put("/message-template", { previewContent });
    revalidatePath("/message-template");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Modelo de mensagem</h1>

      <form
        action={updateTemplate}
        className="max-w-xl space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Conteúdo do modelo de prévia
          </label>
          <textarea
            name="previewContent"
            defaultValue={template?.previewContent ?? ""}
            rows={5}
            className="mt-1 block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#791286]"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Variáveis suportadas: {"{cão}"}, {"{servico}"}, {"{data}"}, {"{hora}"}, {"{preço}"}, {"{tutor}"}
          </p>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[#791286] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0D66] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Salvar modelo
        </button>
      </form>

      {template && (
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Pré-visualização</h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            {template.previewContent}
          </div>
        </section>
      )}
    </div>
  );
}