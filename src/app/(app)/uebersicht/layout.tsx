import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Übersicht",
  description: "Fortschritt, Serie und letzte Ergebnisse für deine Goethe- oder telc-Prüfung.",
  path: "/uebersicht",
});

export default function UebersichtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
