const FALLBACK_SITE_URL = "https://deutscheprobe.vercel.app";

function normalizeSiteUrl(value: string | undefined) {
  const raw = (value || FALLBACK_SITE_URL).trim().replace(/\/+$/, "");
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return FALLBACK_SITE_URL;
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

/** Public origin for canonical URLs, sitemap and Open Graph. */
export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
