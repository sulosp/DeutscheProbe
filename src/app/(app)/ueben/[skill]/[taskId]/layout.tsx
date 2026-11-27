import type { Metadata } from "next";
import { getTask } from "@/content";
import { clipDescription, privatePage } from "@/lib/seo";
import { SKILL_LABEL, isSkill } from "@/lib/skills";

type Props = { params: Promise<{ skill: string; taskId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill, taskId } = await params;
  const task = getTask(taskId);
  const matches = task && task.skill === skill;
  const exam = task?.exam === "telc" ? "telc" : "Goethe";
  const skillLabel = isSkill(skill) ? SKILL_LABEL[skill] : "Übung";
  const title = matches ? `${exam} ${task.level}: ${task.title}` : "Aufgabe";
  const intro = matches ? clipDescription(task.intro) : "";
  const description = matches
    ? intro || `${task.title} für ${exam} ${task.level}. ${skillLabel} üben.`
    : "Diese Aufgabe gibt es in DeutscheProbe nicht.";
  return privatePage({
    title,
    description,
    path: `/ueben/${encodeURIComponent(skill)}/${encodeURIComponent(taskId)}`,
  });
}

export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
