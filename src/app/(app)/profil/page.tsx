"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { getTask } from "@/content";
import { demoMode } from "@/lib/env";
import { initials } from "@/lib/format";
import { useAppState } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/browser";
import { useExamSession } from "@/lib/exam-session";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, attempts, updateProfile, signOut } = useAppState();
  const { clear } = useExamSession();
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [name, setName] = useState("");
  const filled = useRef(false);

  useEffect(() => {
    if (!profile || filled.current) return;
    filled.current = true;
    setGoal(profile.goal);
    setDays(profile.examInDays);
    setName(profile.name);
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-h3 font-bold text-brand-text">{initials(profile.name)}</span>
        <div>
          <h1 className="text-h1 font-semibold">{profile.name}</h1>
          <p className="text-muted">{profile.email}</p>
        </div>
      </div>
      <Card className="grid gap-4 p-5 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="goal">Ziel</Label>
          <Input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="days">Tage bis zur Prüfung</Label>
          <Input id="days" type="number" min={1} max={365} value={days} onChange={(event) => setDays(Number(event.target.value) || 1)} />
        </div>
        <div className="flex items-end">
          <Button
            onClick={() =>
              updateProfile({
                name: name.trim() || profile.name,
                goal: goal.trim(),
                examInDays: Math.max(1, Math.min(365, days)),
              })
            }
          >
            Speichern
          </Button>
        </div>
      </Card>
      <p className="text-small text-muted">
        Aktuell {profile.exam === "goethe" ? "Goethe" : "telc"} {profile.level}. Wechseln über die{" "}
        <Link href="/auswahl" className="font-semibold text-brand-text">
          Prüfungsauswahl
        </Link>
        .
        {demoMode ? " Supabase ist nicht konfiguriert, deshalb bleiben die Daten in diesem Browser." : " Versuche werden zusätzlich in Supabase gespeichert, wenn die Anmeldung aktiv ist."}
      </p>
      <section>
        <h2 className="text-h3 font-semibold">Verlauf</h2>
        <div className="mt-3 space-y-2">
          {attempts.length === 0 ? <p className="text-small text-muted">Noch keine eigenen Versuche.</p> : null}
          {attempts.slice(0, 20).map((attempt) => {
            const task = getTask(attempt.result.taskId);
            return (
              <Card key={attempt.id} className="flex flex-wrap items-center gap-3 p-3">
                {task ? <SkillBadge skill={task.skill} /> : null}
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{task?.title ?? attempt.result.taskId}</div>
                  <div className="text-micro text-muted">
                    {attempt.mode === "exam" ? "Probeprüfung" : "Übung"} · {new Date(attempt.createdAt).toLocaleString("de-DE")}
                  </div>
                </div>
                <span className="font-semibold tabular-nums">{attempt.result.feedback.percent}%</span>
              </Card>
            );
          })}
        </div>
      </section>
      <Button
        variant="secondary"
        onClick={() => {
          const supabase = getSupabase();
          if (supabase) void supabase.auth.signOut();
          clear();
          signOut();
          router.push("/");
        }}
      >
        Abmelden
      </Button>
    </div>
  );
}
