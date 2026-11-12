const FALLBACK = "Bapak/Ibu/Saudara/i";

/**
 * Membaca nama tamu dari parameter URL `?to=`.
 * - Didecode dengan aman (URLSearchParams + try/catch)
 * - Karakter kontrol dibuang & panjang dibatasi
 * - Dikembalikan sebagai string biasa; React meng-escape saat render (aman dari XSS)
 */
export function getGuestName(search: string = window.location.search): string {
  try {
    const raw = new URLSearchParams(search).get("to");
    if (!raw) return FALLBACK;
    // eslint-disable-next-line no-control-regex
    const clean = raw.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return FALLBACK;
    return clean.length > 80 ? `${clean.slice(0, 77)}…` : clean;
  } catch {
    return FALLBACK;
  }
}
