const FALLBACK_PATH = "/uebersicht";

/** Relative same-origin path only, so `next` cannot become an open redirect. */
export function safeNextPath(raw: string | null): string {
  if (!raw) return FALLBACK_PATH;
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return FALLBACK_PATH;
  }
  if (/[\u0000-\u001F]/.test(value)) return FALLBACK_PATH;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return FALLBACK_PATH;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes("://")) {
    return FALLBACK_PATH;
  }
  if (/[\u0000-\u001F]/.test(decoded)) return FALLBACK_PATH;

  try {
    const base = "https://deutscheprobe.invalid";
    const url = new URL(decoded, base);
    if (url.origin !== base) return FALLBACK_PATH;
    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return FALLBACK_PATH;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return FALLBACK_PATH;
  }
}
