import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Probeprüfung",
  description: "Starte eine Probeprüfung mit Timer, in der Reihenfolge des Prüfungstags.",
  path: "/probe",
});

export default function ProbeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
