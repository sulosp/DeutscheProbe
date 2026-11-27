import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Prüfung",
  description: "Die Probeprüfung läuft. Auswertung und Punkte gibt es erst am Ende.",
  path: "/probe/pruefung",
});

export default function PruefungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
