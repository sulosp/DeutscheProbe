"use client";

import Link from "next/link";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tasksFor, tracks } from "@/content";
import { useAppState } from "@/lib/storage";

export default function AuswahlPage() {
  const { profile, setTrack } = useAppState();
  if (!profile) return null;
  const active = `${profile.exam}-${profile.level.toLowerCase()}`;
  const list = tasksFor(profile.exam, profile.level);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-extrabold">Prüfungsauswahl</h1>
        <p className="mt-2 text-muted">Wähle die Strecke. Die Aufgaben darunter gehören dazu und sind Beispieldaten.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((track) => {
          const selected = track.id === active;
          return (
            <button key={track.id} type="button" onClick={() => setTrack(track.exam, track.level)} className="text-left">
              <Card className={`h-full p-4 ${selected ? "border-brand ring-2 ring-brand" : ""}`}>
                <p className="text-micro font-semibold uppercase tracking-wide text-muted">{track.exam}</p>
                <h2 className="mt-1 text-h3 font-bold">{track.level}</h2>
                <p className="mt-2 text-small text-muted">{track.tagline}</p>
              </Card>
            </button>
          );
        })}
      </div>
      <section className="space-y-3">
        <h2 className="text-h3 font-bold">Aufgaben in dieser Strecke</h2>
        {list.map((task) => (
          <Card key={task.id} className="flex flex-wrap items-center gap-3 p-4">
            <SkillBadge skill={task.skill} />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-small text-muted">
                {task.teil} · {task.minutes} Min. · Beispieldaten
              </p>
            </div>
            <Button href={`/ueben/${task.skill}/${task.id}`} variant="secondary" size="sm">
              Öffnen
            </Button>
          </Card>
        ))}
        <Link href="/probe" className="inline-block text-small font-semibold text-brand-text">
          Stattdessen die Probeprüfung starten
        </Link>
      </section>
    </div>
  );
}
