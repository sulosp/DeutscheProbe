import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Ergebnis",
  description: "Punkte und bestandene Teile deiner Probeprüfung.",
  path: "/probe/ergebnis",
});

export default function ErgebnisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
