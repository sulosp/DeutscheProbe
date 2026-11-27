"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { getTask } from "@/content";
import { demoMode } from "@/lib/env";
import { useExamSession } from "@/lib/exam-session";
import { initials } from "@/lib/format";
import { useAppState } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/browser";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, attempts, updateProfile, signOut, clearAccount } = useAppState();
  const { clear } = useExamSession();
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [name, setName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);
  const filled = useRef(false);
  const confirmed = confirm.trim().toLocaleUpperCase("de-DE") === "LÖSCHEN";

  useEffect(() => {
    if (!profile || filled.current) return;
    filled.current = true;
    setGoal(profile.goal);
    setDays(profile.examInDays);
    setName(profile.name);
  }, [profile]);

  if (!profile) return null;

  function closeDelete() {
    if (deletePending) return;
    setDeleteOpen(false);
    setConfirm("");
    setDeleteError("");
  }

  function leaveAfterDelete() {
    clearAccount();
    window.location.replace("/");
  }

  async function onDelete() {
    if (!confirmed || deletePending) return;
    setDeleteError("");
    setDeletePending(true);
    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!response.ok) {
        if (response.status === 401 && profile?.auth === "demo") {
          leaveAfterDelete();
          return;
        }
        setDeleteError(payload.error || "Das Konto konnte nicht gelöscht werden.");
        setDeletePending(false);
        return;
      }
      leaveAfterDelete();
    } catch {
      if (demoMode) {
        leaveAfterDelete();
        return;
      }
      setDeleteError("Das Konto konnte nicht gelöscht werden. Bitte versuche es erneut.");
      setDeletePending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-h3 font-bold text-brand-text">{initials(profile.name)}</span>
        <div>
          <h1 className="text-h1 font-extrabold">{profile.name}</h1>
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
        <h2 className="text-h3 font-bold">Verlauf</h2>
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
      <section id="konto-loeschen" className="rounded-xl border border-danger/30 bg-danger-soft p-5">
        <h2 className="text-h3 font-bold text-danger">Konto löschen</h2>
        <p className="mt-2 max-w-2xl text-small text-muted">
          {demoMode
            ? "Im Demo-Modus liegen Profil und Versuche nur in diesem Browser. Löschen entfernt sie hier."
            : "Profil, Versuche und die Anmeldung werden dauerhaft gelöscht. Das lässt sich nicht rückgängig machen."}
        </p>
        <Button variant="danger" className="mt-4" onClick={() => setDeleteOpen(true)}>
          Konto löschen
        </Button>
      </section>
      <Modal open={deleteOpen} title="Konto wirklich löschen?" onClose={closeDelete}>
        <p>
          {demoMode
            ? "Die Daten in diesem Browser werden entfernt."
            : "Profil, Versuche und die Anmeldung werden unwiderruflich gelöscht."}{" "}
          Tippe <span className="font-semibold text-foreground">LÖSCHEN</span> zur Bestätigung.
        </p>
        <div className="mt-4">
          <Label htmlFor="delete-confirm">Bestätigung</Label>
          <Input
            id="delete-confirm"
            value={confirm}
            autoComplete="off"
            placeholder="LÖSCHEN"
            onChange={(event) => setConfirm(event.target.value)}
          />
        </div>
        <FieldError>{deleteError}</FieldError>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={closeDelete} disabled={deletePending}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={() => void onDelete()} disabled={!confirmed || deletePending}>
            Endgültig löschen
          </Button>
        </div>
      </Modal>
    </div>
  );
}
