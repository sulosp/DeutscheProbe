"use client";

import { useParams } from "next/navigation";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { findTrack, tasksFor } from "@/content";
import { getMockForTrack } from "@/content/exams";
import { SKILL_HINT, SKILL_LABEL, isSkill } from "@/lib/skills";
import { useAppState } from "@/lib/storage";

export default function SkillPage() {
  const params = useParams<{ skill: string }>();
  const { profile } = useAppState();
  if (!profile) return null;
  const skill = params.skill;
  if (!isSkill(skill)) {
    return <p className="text-muted">Diese Fertigkeit gibt es nicht.</p>;
  }
  const track = findTrack(profile.exam, profile.level);
  if (!track.skills.includes(skill)) {
    return (
      <Card className="p-5">
        <h1 className="text-h2 font-extrabold">{SKILL_LABEL[skill]}</h1>
        <p className="mt-2 text-muted">In {track.title} ist diese Fertigkeit kein eigener Prüfungsteil.</p>
        <Button href="/uebersicht" className="mt-4">
          Zur Übersicht
        </Button>
      </Card>
    );
  }
  const list = tasksFor(profile.exam, profile.level, skill);
  const mock = getMockForTrack(track.id);
  const teile = mock?.modules.find((module) => module.skill === skill)?.teile ?? [];
  return (
    <div className="space-y-5">
      <div>
        <SkillBadge skill={skill} />
        <h1 className="mt-3 text-h1 font-extrabold">{SKILL_LABEL[skill]}</h1>
        <p className="mt-2 max-w-2xl text-muted">{SKILL_HINT[skill]}</p>
      </div>
      {teile.map((teil) => (
        <Card key={teil.id} className="p-5">
          <p className="text-micro font-semibold text-muted">
            Beispieldaten · {mock?.title} · Teil {teil.number}
          </p>
          <h2 className="mt-2 text-h3 font-semibold">{teil.title}</h2>
          <p className="mt-2 text-small text-muted">{teil.instruction}</p>
          <Button href={`/ueben/${skill}/teil/${teil.id}`} className="mt-4">
            Teil üben
          </Button>
        </Card>
      ))}
      {list.map((task) => (
        <Card key={task.id} className="p-5">
          <p className="text-micro font-semibold text-muted">Beispieldaten · {task.teil}</p>
          <h2 className="mt-2 text-h3 font-bold">{task.title}</h2>
          <p className="mt-2 text-small text-muted">{task.intro}</p>
          <Button href={`/ueben/${skill}/${task.id}`} className="mt-4">
            Aufgabe öffnen
          </Button>
        </Card>
      ))}
    </div>
  );
}
