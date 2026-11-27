import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/anmelden",
        "/registrieren",
        "/onboarding",
        "/design-system",
        "/uebersicht",
        "/auswahl",
        "/profil",
        "/probe",
        "/ueben",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
