import { privatePage } from "@/lib/seo";

export const metadata = privatePage({
  title: "Prüfung wählen",
  description: "Wähle Goethe oder telc und dein Niveau von A1 bis B2.",
  path: "/onboarding",
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
