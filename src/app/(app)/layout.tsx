import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Üben",
  description: "Übungen und Probeprüfungen für Goethe und telc.",
  path: "/uebersicht",
});

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
