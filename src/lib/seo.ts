import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const SITE_NAME = "DeutscheProbe";

/** Replace `public/og.png` to swap the default share image. */
export const OG_IMAGE_PATH = "/og.png";

export const HOME_TITLE = "DeutscheProbe · Goethe und telc üben";

export const HOME_DESCRIPTION =
  "Übe Deutsch für Goethe und telc von A1 bis B2: Lesen, Hören, Schreiben, Sprechen und Probeprüfungen mit Timer. Kostenlos, ohne Abo.";

export const ogImage = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "DeutscheProbe: Goethe und telc von A1 bis B2 üben",
} as const;

export function absoluteUrl(path: string) {
  if (path === "/" || path === "") return siteUrl;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

/** Drop product-internal wording so it never lands in a meta description. */
export function cleanMetaText(text: string) {
  return text
    .replace(/\s*Beispieldaten(?:,\s*keine Prüfungsaufgabe)?\.?/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/^[\s,]+|[\s,]+$/g, "")
    .replace(/\.{2,}/g, ".")
    .trim();
}

export function clipDescription(text: string, max = 160) {
  const clean = cleanMetaText(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const trimmed = (space > 80 ? cut.slice(0, space) : cut).trimEnd();
  return `${trimmed}…`;
}

function brandedTitle(title: string) {
  if (title.includes(SITE_NAME)) return title;
  return `${title} · ${SITE_NAME}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const safeDescription = clipDescription(description) || HOME_DESCRIPTION;
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const socialTitle = brandedTitle(title);
  return {
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description: safeDescription,
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: { absolute: socialTitle },
      description: safeDescription,
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: socialTitle },
      description: safeDescription,
      images: [OG_IMAGE_PATH],
    },
  };
}

export function privatePage(args: { title: string; description: string; path: string }): Metadata {
  return pageMetadata({ ...args, index: false });
}
