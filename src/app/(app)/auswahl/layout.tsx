import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Prüfungsauswahl",
  description: "Wechsle zwischen Goethe und telc, jeweils von A1 bis B2.",
  path: "/auswahl",
});

export default function AuswahlLayout({ children }: { children: React.ReactNode }) {
  return children;
}
