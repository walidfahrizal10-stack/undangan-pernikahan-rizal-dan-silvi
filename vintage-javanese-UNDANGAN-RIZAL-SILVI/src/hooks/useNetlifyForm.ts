import { useCallback, useState } from "react";

export type FormStatus = "idle" | "sending" | "success" | "error";

/**
 * Mengirim form ke Netlify Forms (POST "/").
 * Status "success" HANYA di-set jika server membalas HTTP 2xx.
 */
export function useNetlifyForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const submit = useCallback(async (form: HTMLFormElement): Promise<boolean> => {
    setStatus("sending");
    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") body.append(key, value);
      });
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, []);

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, submit, reset };
}
