"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useAppState } from "@/lib/storage";
import { useIsClient } from "@/lib/use-is-client";
import type { ExamId, Level } from "@/lib/types";

const exams: Array<{ id: ExamId; title: string; text: string }> = [
  { id: "goethe", title: "Goethe", text: "A1 bis B2. Schriftlich meist Lesen, Hören, Schreiben, dann Sprechen." },
  { id: "telc", title: "telc", text: "A1 bis B2. Bei B1 und B2 kommen Sprachbausteine dazu." },
];

const levels: Array<{ id: Level; text: string }> = [
  { id: "A1", text: "Sich vorstellen, Schilder, kurze Nachrichten." },
  { id: "A2", text: "Termine, einfache E-Mails, Alltag planen." },
  { id: "B1", text: "Meinung, längere E-Mails, Gespräche führen." },
  { id: "B2", text: "Argumentieren, formelle Texte, Diskussion." },
];

export default function OnboardingPage() {
  const ready = useIsClient();
  const router = useRouter();
  const { profile, completeOnboarding } = useAppState();
  const [step, setStep] = useState(0);
  const [exam, setExam] = useState<ExamId>("goethe");
  const [level, setLevel] = useState<Level>("B1");
  const [goal, setGoal] = useState("Prüfung bestehen");
  const [days, setDays] = useState(38);

  useEffect(() => {
    if (!ready) return;
    if (!profile) router.replace("/registrieren");
    else if (profile.onboarded) router.replace("/uebersicht");
  }, [ready, profile, router]);

  if (!ready || !profile || profile.onboarded) return <p className="p-8 text-muted">Einen Moment …</p>;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-small font-bold text-brand-text">Schritt {step + 1} von 3</p>
        <div className="mt-3 flex gap-2" aria-hidden>
          {[0, 1, 2].map((index) => (
            <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-brand" : "bg-sunken"}`} />
          ))}
        </div>
        <h1 className="mt-4 text-h1 font-extrabold tracking-tight">
          {step === 0 ? "Welche Prüfung planst du?" : step === 1 ? "Welches Niveau?" : "Was ist dein Ziel?"}
        </h1>
        {step === 0 ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {exams.map((item) => (
              <button key={item.id} type="button" onClick={() => setExam(item.id)} className="text-left">
                <Card className={`h-full p-5 ${exam === item.id ? "border-brand-text ring-2 ring-brand-text/40 dark:border-brand dark:ring-brand" : ""}`}>
                  <h2 className="text-h3 font-bold">{item.title}</h2>
                  <p className="mt-2 text-small text-muted">{item.text}</p>
                </Card>
              </button>
            ))}
          </div>
        ) : null}
        {step === 1 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {levels.map((item) => (
              <button key={item.id} type="button" onClick={() => setLevel(item.id)} className="text-left">
                <Card className={`h-full p-5 ${level === item.id ? "border-brand-text ring-2 ring-brand-text/40 dark:border-brand dark:ring-brand" : ""}`}>
                  <h2 className="text-h3 font-bold">{item.id}</h2>
                  <p className="mt-2 text-small text-muted">{item.text}</p>
                </Card>
              </button>
            ))}
          </div>
        ) : null}
        {step === 2 ? (
          <Card className="mt-6 space-y-4 p-5">
            <div>
              <Label htmlFor="goal">Ziel</Label>
              <Input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="days">Prüfung in wie vielen Tagen?</Label>
              <Input id="days" type="number" min={1} max={365} value={days} onChange={(event) => setDays(Number(event.target.value) || 1)} />
            </div>
            <p className="text-small text-muted">
              {exam === "goethe" ? "Goethe" : "telc"} {level} · {goal || "Prüfung bestehen"}
            </p>
          </Card>
        ) : null}
        <div className="mt-6 flex gap-3">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>
              Zurück
            </Button>
          ) : null}
          {step < 2 ? (
            <Button onClick={() => setStep((value) => value + 1)}>Weiter</Button>
          ) : (
            <Button
              onClick={() => {
                completeOnboarding({
                  exam,
                  level,
                  goal: goal.trim() || "Prüfung bestehen",
                  examInDays: Math.max(1, Math.min(365, days)),
                });
                router.push("/uebersicht");
              }}
            >
              Los gehts
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
