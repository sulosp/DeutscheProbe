"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HoerenPlayer } from "@/components/full-exam/hoeren-player";
import { SolvedExample, Stimuli, TeilQuestions } from "@/components/full-exam/items";
import { SchreibenTeil, SprechenTeil } from "@/components/full-exam/productive";
import { ExamResults } from "@/components/full-exam/results";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Timer } from "@/components/ui/timer";
import { getMock } from "@/content/exams";
import { audioManifest } from "@/content/exams/manifest-data";
import { emptySpeaking, useFullExamSession, type FullExamPhase, type FullExamSession, type HoerenPlayback } from "@/lib/full-exam-session";
import type { ExamModule, MockExam } from "@/lib/exam-model";
import { useCountdown } from "@/lib/use-countdown";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

export function FullExamStart({ exam }: { exam: MockExam }) {
  const router = useRouter();
  const { session, start } = useFullExamSession();
  const [mode, setMode] = useState<"exam" | "training">("exam");
  const [heard, setHeard] = useState(false);
  const work = exam.modules.reduce((sum, module) => sum + module.minutes, 0);
  const prep = exam.modules.reduce((sum, module) => sum + (module.prepMinutes ?? 0), 0);

  function checkHeadphones() {
    const voiceSrc = audioManifest.cues.headphone?.src;
    const gongSrc = audioManifest.cues.gong?.src;
    if (!voiceSrc) return;
    const voice = new Audio(voiceSrc);
    voice.onended = () => {
      if (!gongSrc) {
        setHeard(true);
        return;
      }
      void new Audio(gongSrc).play().then(() => setHeard(true)).catch(() => setHeard(true));
    };
    voice.onerror = () => setHeard(false);
    void voice.play().catch(() => setHeard(false));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-small font-semibold text-brand-text">Probeprüfung · {exam.title}</p>
        <h1 className="mt-2 text-h1 font-semibold tracking-tight">Komplette Prüfung</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Lesen, Hören, Schreiben und Sprechen in der Reihenfolge des Prüfungstags. Jedes Modul gilt ab 60 von 100 Punkten als bestanden. Alle Texte sind Beispieldaten.
        </p>
      </div>
      <Card className="divide-y divide-border">
        {exam.modules.map((module, index) => (
          <div key={module.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-small font-bold text-brand-text">{index + 1}</span>
            <SkillBadge skill={module.skill} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{module.title}</div>
              <div className="text-small text-muted">
                {module.teile.length} {module.teile.length === 1 ? "Teil" : "Teile"}
                {module.transferMinutes ? ` · ${module.transferMinutes} Min. Antwortbogen` : ""}
                {module.prepMinutes ? ` · ${module.prepMinutes} Min. Vorbereitung` : ""}
              </div>
            </div>
            <div className="text-small font-semibold tabular-nums">{module.minutes} Min.</div>
          </div>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <h2 className="font-semibold">Vor dem Start</h2>
        <ul className="list-disc space-y-1 pl-5 text-small text-muted">
          <li>Kein Wörterbuch. Die Zeit läuft pro Modul weiter, auch nach einem Neuladen dieses Tabs.</li>
          <li>Im Prüfungsmodus startet Hören von selbst: keine Pause, kein Zurückspulen, die Texte laufen so oft wie in der Prüfung.</li>
          <li>Antworten bleiben in diesem Tab gespeichert.</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={checkHeadphones}>
            Kopfhörer prüfen
          </Button>
          {heard ? <span className="self-center text-small text-brand-text">Signal gehört.</span> : null}
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("exam")}
          className={cn("rounded-full px-4 py-2 text-small font-semibold", mode === "exam" ? "bg-brand text-brand-foreground" : "bg-sunken")}
        >
          Prüfungsmodus
        </button>
        <button
          type="button"
          onClick={() => setMode("training")}
          className={cn("rounded-full px-4 py-2 text-small font-semibold", mode === "training" ? "bg-brand text-brand-foreground" : "bg-sunken")}
        >
          Training mit Pause
        </button>
      </div>
      <p className="text-small text-muted">
        Arbeitszeit etwa {work} Minuten{prep ? `, dazu ${prep} Minuten Vorbereitung` : ""}. Zwischen Lesen und Hören und nach dem Hören ist eine Pause vorgesehen. Du kannst sie überspringen.
      </p>
      {session?.mockId === exam.id && session.status === "active" ? (
        <Button href="/probe/pruefung" variant="secondary">
          Laufende Prüfung fortsetzen
        </Button>
      ) : null}
      {session?.mockId === exam.id && session.status === "review" ? (
        <Button href="/probe/pruefung" variant="secondary">
          Letztes Ergebnis ansehen
        </Button>
      ) : null}
      <Button
        onClick={() => {
          start(exam.id, mode);
          router.push("/probe/pruefung");
        }}
      >
        Prüfung starten
      </Button>
    </div>
  );
}

export function FullExamRunner() {
  const router = useRouter();
  const ready = useIsClient();
  const { session, patch, clear } = useFullExamSession();
  const exam = session ? getMock(session.mockId) : null;
  const seconds = useCountdown(session?.endsAt ?? null);
  const fired = useRef("");
  const [confirm, setConfirm] = useState<"cancel" | "finish" | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!session || !exam) router.replace("/probe");
  }, [ready, session, exam, router]);

  useEffect(() => {
    if (!session || !exam || session.mode === "training") return;
    if (seconds !== 0 || !session.endsAt) return;
    const key = `${session.phase}:${session.moduleIndex}:${session.teilIndex}:${session.endsAt}`;
    if (fired.current === key) return;
    fired.current = key;
    const part = exam.modules[session.moduleIndex];
    if (!part) return;
    if (session.phase === "oral-prep") {
      const minutes = part.teile[0]?.speaking?.minutes ?? 3;
      patch((current) => ({ ...current, phase: "run", teilIndex: 0, endsAt: Date.now() + minutes * 60 * 1000 }));
      return;
    }
    if (session.phase === "break") {
      advanceAfterModule(exam, session.moduleIndex, patch);
      return;
    }
    if (session.phase === "transfer") {
      closeModule(exam, patch);
      return;
    }
    if (session.phase === "run" && part.skill === "sprechen") {
      const nextTeil = session.teilIndex + 1;
      if (nextTeil < part.teile.length) {
        const minutes = part.teile[nextTeil]?.speaking?.minutes ?? 3;
        patch((current) => ({ ...current, teilIndex: nextTeil, endsAt: Date.now() + minutes * 60 * 1000 }));
        return;
      }
      closeModule(exam, patch);
      return;
    }
    if (session.phase === "run" && part.transferMinutes) {
      patch((current) => ({
        ...current,
        phase: "transfer",
        hoeren: null,
        endsAt: Date.now() + (part.transferMinutes ?? 5) * 60 * 1000,
      }));
      return;
    }
    if (session.phase === "run") closeModule(exam, patch);
  }, [seconds, session, exam, patch]);

  if (!ready || !session || !exam) return <p className="text-muted">Prüfung wird geladen …</p>;

  const live = session;
  const paper = exam;
  const part = paper.modules[live.moduleIndex];

  function begin() {
    if (!part) return;
    const timing = (current: FullExamSession) => {
      if (current.moduleTiming[part.id]) return current.moduleTiming;
      return { ...current.moduleTiming, [part.id]: { startedAt: Date.now() } };
    };
    if (part.prepMinutes && live.phase === "module-intro") {
      patch((current) => ({
        ...current,
        phase: "oral-prep",
        endsAt: Date.now() + part.prepMinutes! * 60 * 1000,
        moduleTiming: timing(current),
      }));
      return;
    }
    if (part.skill === "hoeren") {
      patch((current) => ({
        ...current,
        phase: "run",
        hoeren: { stepIndex: 0, pauseEndsAt: null },
        endsAt: Date.now() + part.minutes * 60 * 1000,
        moduleTiming: timing(current),
      }));
      return;
    }
    const minutes = part.skill === "sprechen" ? (part.teile[0]?.speaking?.minutes ?? 3) : part.minutes;
    patch((current) => ({
      ...current,
      phase: "run",
      teilIndex: 0,
      endsAt: Date.now() + minutes * 60 * 1000,
      moduleTiming: timing(current),
    }));
  }

  function requestFinish() {
    if (!part) return;
    if (part.transferMinutes && live.phase === "run") {
      patch((current) => ({
        ...current,
        phase: "transfer",
        hoeren: null,
        endsAt: Date.now() + (part.transferMinutes ?? 5) * 60 * 1000,
      }));
      setConfirm(null);
      return;
    }
    closeModule(paper, patch);
    setConfirm(null);
  }

  return (
    <div className="space-y-5">
      {session.phase !== "results" && part ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SkillBadge skill={part.skill} />
            <span className="text-small text-muted">
              Modul {session.moduleIndex + 1} von {exam.modules.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {seconds !== null ? (
              <Timer seconds={seconds} label={session.phase === "oral-prep" ? "Vorbereitung" : session.phase === "transfer" ? "Antwortbogen" : session.phase === "break" ? "Pause" : "Zeit"} />
            ) : null}
            {session.phase === "run" || session.phase === "transfer" ? (
              <Button variant="secondary" size="sm" onClick={() => setConfirm("finish")}>
                Modul beenden
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => setConfirm("cancel")}>
              Abbrechen
            </Button>
          </div>
        </div>
      ) : null}

      {session.phase === "results" ? (
        <ExamResults exam={exam} session={session} onFeedback={(feedback) => patch((current) => ({ ...current, feedback }))} />
      ) : null}

      {session.phase === "module-intro" && part ? <ModuleIntro module={part} onStart={begin} /> : null}
      {session.phase === "break" ? (
        <BreakScreen
          exam={exam}
          moduleIndex={session.moduleIndex}
          onContinue={() => advanceAfterModule(exam, session.moduleIndex, patch)}
        />
      ) : null}
      {session.phase === "oral-prep" && part ? (
        <PrepScreen
          module={part}
          notes={session.prepNotes}
          onNotes={(prepNotes) => patch((current) => ({ ...current, prepNotes }))}
          onSkip={begin}
        />
      ) : null}
      {session.phase === "transfer" && part ? (
        <Transfer module={part} session={session} onAnswer={(itemId, optionId) => patch((current) => ({ ...current, answers: { ...current.answers, [itemId]: optionId } }))} />
      ) : null}
      {session.phase === "run" && part?.skill === "hoeren" && session.hoeren ? (
        <HoerenPlayer
          module={part}
          playback={session.hoeren}
          mode={session.mode}
          answers={session.answers}
          onAnswer={(itemId, optionId) => patch((current) => ({ ...current, answers: { ...current.answers, [itemId]: optionId } }))}
          onPlayback={(hoeren: HoerenPlayback) => patch((current) => ({ ...current, hoeren }))}
          onDone={() =>
            patch((current) => ({
              ...current,
              phase: "transfer",
              hoeren: null,
              endsAt: Date.now() + (part.transferMinutes ?? 5) * 60 * 1000,
            }))
          }
        />
      ) : null}
      {session.phase === "run" && part && (part.skill === "lesen" || part.skill === "schreiben" || part.skill === "sprechen") ? (
        <ModuleRun module={part} session={session} patch={patch} />
      ) : null}

      <Modal open={confirm !== null} title={confirm === "cancel" ? "Prüfung abbrechen?" : "Modul beenden?"} onClose={() => setConfirm(null)}>
        <p>
          {confirm === "cancel"
            ? "Die Antworten in diesem Tab werden gelöscht."
            : "Die restliche Zeit dieses Moduls verfällt. Schon gesetzte Antworten bleiben für das Ergebnis erhalten."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={confirm === "cancel" ? "danger" : "primary"}
            onClick={() => {
              if (confirm === "cancel") {
                clear();
                router.push("/uebersicht");
                return;
              }
              requestFinish();
            }}
          >
            {confirm === "cancel" ? "Abbrechen" : "Modul beenden"}
          </Button>
          <Button variant="secondary" onClick={() => setConfirm(null)}>
            Weiterarbeiten
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function closeModule(exam: MockExam, patch: (change: (session: FullExamSession) => FullExamSession) => void) {
  patch((current) => {
    const part = exam.modules[current.moduleIndex];
    const moduleTiming = { ...current.moduleTiming };
    if (part) {
      const startedAt = moduleTiming[part.id]?.startedAt ?? Date.now();
      moduleTiming[part.id] = { startedAt, endedAt: Date.now() };
    }
    const gap = exam.breaks.find((item) => item.afterModuleId === part?.id);
    if (gap) {
      return { ...current, phase: "break", endsAt: Date.now() + gap.minutes * 60 * 1000, hoeren: null, moduleTiming };
    }
    return advance(exam, current, moduleTiming);
  });
}

function advanceAfterModule(exam: MockExam, moduleIndex: number, patch: (change: (session: FullExamSession) => FullExamSession) => void) {
  patch((current) => advance(exam, { ...current, moduleIndex }, current.moduleTiming));
}

function advance(exam: MockExam, current: FullExamSession, moduleTiming: FullExamSession["moduleTiming"]): FullExamSession {
  const next = current.moduleIndex + 1;
  if (next >= exam.modules.length) {
    return { ...current, phase: "results", status: "review", endsAt: null, hoeren: null, moduleTiming };
  }
  return {
    ...current,
    moduleIndex: next,
    phase: "module-intro" satisfies FullExamPhase,
    teilIndex: 0,
    endsAt: null,
    hoeren: null,
    moduleTiming,
  };
}

function ModuleIntro({ module, onStart }: { module: ExamModule; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-6">
      <SkillBadge skill={module.skill} />
      <h1 className="text-h1 font-semibold">{module.title}</h1>
      <p className="text-muted">{module.intro.text}</p>
      <p className="text-small text-muted">{module.minutes} Minuten{module.prepMinutes ? `, davor ${module.prepMinutes} Minuten Vorbereitung` : ""}.</p>
      <Button onClick={onStart}>{module.prepMinutes ? "Vorbereitung starten" : `${module.title} starten`}</Button>
    </div>
  );
}

function BreakScreen({ exam, moduleIndex, onContinue }: { exam: MockExam; moduleIndex: number; onContinue: () => void }) {
  const done = exam.modules[moduleIndex];
  const next = exam.modules[moduleIndex + 1];
  return (
    <div className="mx-auto max-w-xl space-y-4 py-6 text-center">
      <p className="text-small font-semibold text-brand-text">Pause</p>
      <h1 className="text-h1 font-semibold">{done ? `${done.title} ist beendet` : "Pause"}</h1>
      <p className="text-muted">
        {next ? `Als Nächstes kommt ${next.title}. In der Prüfung liegt zwischen den Modulen eine Pause. Hier kannst du sofort weitergehen.` : "Das war das letzte Modul."}
      </p>
      <Button onClick={onContinue}>{next ? `${next.title} vorbereiten` : "Zum Ergebnis"}</Button>
    </div>
  );
}

function PrepScreen({ module, notes, onNotes, onSkip }: { module: ExamModule; notes: string; onNotes: (value: string) => void; onSkip: () => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-h2 font-semibold">Vorbereitung {module.title}</h1>
      <p className="text-muted">Notiere Stichworte. Die Notizen bleiben in diesem Tab. In der Prüfung sind es {module.prepMinutes} Minuten.</p>
      <Textarea value={notes} onChange={(event) => onNotes(event.target.value)} aria-label="Vorbereitungsnotizen" />
      <Button onClick={onSkip}>Vorbereitung beenden</Button>
    </div>
  );
}

function Transfer({
  module,
  session,
  onAnswer,
}: {
  module: ExamModule;
  session: FullExamSession;
  onAnswer: (itemId: string, optionId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-h2 font-semibold">Antwortbogen</h1>
        <p className="mt-2 text-muted">Übertragen Sie Ihre Lösungen. Sie können die Kreuze noch ändern, bis die Zeit abläuft.</p>
      </div>
      {module.teile.map((teil) => (
        <section key={teil.id} className="space-y-3">
          <h2 className="font-semibold">
            Teil {teil.number} · {teil.title}
          </h2>
          <TeilQuestions teil={teil} answers={session.answers} onAnswer={onAnswer} />
        </section>
      ))}
    </div>
  );
}

function ModuleRun({
  module,
  session,
  patch,
}: {
  module: ExamModule;
  session: FullExamSession;
  patch: (change: (session: FullExamSession) => FullExamSession) => void;
}) {
  const teil = module.teile[session.teilIndex] ?? module.teile[0];
  if (!teil) return null;
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {module.teile.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => {
              if (module.skill === "sprechen" && session.mode === "exam") return;
              patch((current) => ({ ...current, teilIndex: index }));
            }}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-small font-semibold",
              session.teilIndex === index ? "bg-brand text-brand-foreground" : "bg-sunken text-muted",
            )}
          >
            Teil {entry.number}
            {entry.suggestedMinutes ? ` · ${entry.suggestedMinutes} Min.` : ""}
          </button>
        ))}
      </div>
      {module.skill === "lesen" ? (
        <div className="space-y-4">
          <p className="text-small text-muted">{teil.instruction}</p>
          <Stimuli teil={teil} />
          <SolvedExample teil={teil} />
          <TeilQuestions
            teil={teil}
            answers={session.answers}
            onAnswer={(itemId, optionId) => patch((current) => ({ ...current, answers: { ...current.answers, [itemId]: optionId } }))}
          />
        </div>
      ) : null}
      {module.skill === "schreiben" ? (
        <SchreibenTeil
          teil={teil}
          text={session.writing[teil.id] ?? ""}
          onText={(value) => patch((current) => ({ ...current, writing: { ...current.writing, [teil.id]: value } }))}
        />
      ) : null}
      {module.skill === "sprechen" && teil.speaking ? (
        <SprechenTeil
          teil={teil}
          draft={session.speaking[teil.id] ?? emptySpeaking()}
          topicId={session.answers["gb1-sprechen-2-topic"]}
          audioScope={session.id}
          autoPlay={session.mode === "exam"}
          onTopic={(topicId) => patch((current) => ({ ...current, answers: { ...current.answers, "gb1-sprechen-2-topic": topicId } }))}
          onDraft={(draft) => patch((current) => ({ ...current, speaking: { ...current.speaking, [teil.id]: draft } }))}
        />
      ) : null}
    </div>
  );
}
