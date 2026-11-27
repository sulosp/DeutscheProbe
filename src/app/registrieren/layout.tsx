import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Konto erstellen",
  description: "Erstelle ein kostenloses Konto und übe Goethe- und telc-Deutsch von A1 bis B2.",
  path: "/registrieren",
});

export default function RegistrierenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
