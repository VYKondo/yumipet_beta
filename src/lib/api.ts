import { createClient } from "@/lib/supabase/server";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getAccessToken(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  } catch {
    return "";
  }
}

export async function fetchApi(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body?.message || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: (path: string) => fetchApi(path),
  put: (path: string, body: unknown) =>
    fetchApi(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  post: (path: string, body: unknown) =>
    fetchApi(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (path: string) =>
    fetchApi(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }),
};
