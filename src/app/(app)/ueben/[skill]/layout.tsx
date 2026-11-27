import type { Metadata } from "next";
import { privatePage } from "@/lib/seo";
import { SKILL_HINT, SKILL_LABEL, isSkill } from "@/lib/skills";

type Props = { params: Promise<{ skill: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill } = await params;
  const known = isSkill(skill);
  const label = known ? SKILL_LABEL[skill] : "Üben";
  return privatePage({
    title: known ? `${label} üben` : "Üben",
    description: known ? SKILL_HINT[skill] : "Diese Fertigkeit gibt es in DeutscheProbe nicht.",
    path: `/ueben/${encodeURIComponent(skill)}`,
  });
}

export default function SkillLayout({ children }: { children: React.ReactNode }) {
  return children;
}
