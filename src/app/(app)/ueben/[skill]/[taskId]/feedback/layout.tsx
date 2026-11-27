import type { Metadata } from "next";
import { getTask } from "@/content";
import { privatePage } from "@/lib/seo";

type Props = { params: Promise<{ skill: string; taskId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill, taskId } = await params;
  const task = getTask(taskId);
  const matches = task && task.skill === skill;
  const title = matches ? `Rückmeldung: ${task.title}` : "Rückmeldung";
  const description = matches
    ? `Rückmeldung zu „${task.title}“: was schon sitzt und was du als Nächstes üben kannst.`
    : "Zu dieser Aufgabe gibt es keine Rückmeldung.";
  return privatePage({
    title,
    description,
    path: `/ueben/${encodeURIComponent(skill)}/${encodeURIComponent(taskId)}/feedback`,
  });
}

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
