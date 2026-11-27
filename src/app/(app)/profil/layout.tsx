import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Profil",
  description: "Name, Lernziel und Prüfungstermin für dein DeutscheProbe-Konto.",
  path: "/profil",
});

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
