import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Design-System",
  description: "Farben, Schriften und Bausteine der DeutscheProbe-Oberfläche.",
  path: "/design-system",
});

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
