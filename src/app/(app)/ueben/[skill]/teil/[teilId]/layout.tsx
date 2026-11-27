import type { Metadata } from "next";
import { findTeil } from "@/content/exams";
import { clipDescription, privatePage } from "@/lib/seo";

type Props = { params: Promise<{ skill: string; teilId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill, teilId } = await params;
  const found = findTeil(teilId);
  const matches = found && found.module.skill === skill;
  const exam = found?.exam.provider === "telc" ? "telc" : "Goethe";
  const title = matches ? `${exam} ${found.exam.level} · Teil ${found.teil.number}: ${found.teil.title}` : "Übungsteil";
  const description = matches
    ? clipDescription(found.teil.instruction || `${found.module.title}, Teil ${found.teil.number}.`)
    : "Diesen Teil gibt es in DeutscheProbe nicht.";
  return privatePage({
    title,
    description,
    path: `/ueben/${encodeURIComponent(skill)}/teil/${encodeURIComponent(teilId)}`,
  });
}

export default function TeilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
