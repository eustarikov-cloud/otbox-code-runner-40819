import { supabase } from "@/integrations/supabase/client";

/**
 * Calls a backend function from the browser.
 *
 * Normally `supabase.functions.invoke()` is enough.
 * This helper adds a fallback path for cases where the request is made without `apikey`
 * (which results in: "No API key found in request").
 */
export async function invokePublicFunction<T>(
  functionName: string,
  body: unknown
): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase.functions.invoke<T>(functionName, { body });

  if (!error) return { data: (data ?? null) as T | null, error: null };

  const msg = String((error as any)?.message ?? error);
  if (!msg.includes("No API key found")) {
    return { data: null, error: error as any };
  }

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!baseUrl || !anonKey) {
    return {
      data: null,
      error: new Error("Backend is not configured (missing URL or key)."),
    };
  }

  const resp = await fetch(`${baseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  const json = await resp.json().catch(() => null);

  if (!resp.ok) {
    const message =
      (json && (json.error || json.message || json.hint)) ||
      `HTTP ${resp.status} calling ${functionName}`;
    return { data: null, error: new Error(String(message)) };
  }

  return { data: json as T, error: null };
}
