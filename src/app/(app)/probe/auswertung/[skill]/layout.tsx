import type { Metadata } from "next";
import { privatePage } from "@/lib/seo";
import { SKILL_LABEL, isSkill } from "@/lib/skills";

type Props = { params: Promise<{ skill: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill } = await params;
  const label = isSkill(skill) ? SKILL_LABEL[skill] : "Prüfung";
  return privatePage({
    title: `Auswertung ${label}`,
    description: `Auswertung für ${label} nach der Probeprüfung: Punkte, was sitzt und was als Nächstes dran ist.`,
    path: `/probe/auswertung/${encodeURIComponent(skill)}`,
  });
}

export default function AuswertungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
