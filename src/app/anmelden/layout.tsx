import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Anmelden",
  description: "Melde dich bei DeutscheProbe an, um Goethe- und telc-Deutsch weiterzuüben.",
  path: "/anmelden",
});

export default function AnmeldenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
