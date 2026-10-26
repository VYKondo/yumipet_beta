export default function AppLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 animate-pulse">
          Carregando…
        </h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-96 animate-pulse" />
    </div>
  );
}
