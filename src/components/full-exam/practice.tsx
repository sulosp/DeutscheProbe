"use client";

import { useState } from "react";
import { SolvedExample, Stimuli, TeilQuestions } from "@/components/full-exam/items";
import { SchreibenTeil, SprechenTeil } from "@/components/full-exam/productive";
import { Badge, SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { audioManifest } from "@/content/exams/manifest-data";
import { emptySpeaking, type SpeakingDraft } from "@/lib/full-exam-session";
import type { ExamModule, Teil } from "@/lib/exam-model";
import { assessSpeakingTask, assessWritingTask, scoreObjectiveTeil } from "@/lib/scoring-rules";
import type { Feedback } from "@/lib/types";

export function PracticeTeil({ module, teil }: { module: ExamModule; teil: Teil }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState<SpeakingDraft>(emptySpeaking());
  const [topic, setTopic] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [pending, setPending] = useState(false);
  const objective = !teil.writing && !teil.speaking;

  async function submit() {
    if (teil.writing) {
      const mock = assessWritingTask(teil.writing, text);
      setFeedback(mock);
      setPending(true);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mockId: "goethe-b1-mock-1", teilId: teil.id, text, notes: "", checklist: [], durationSec: 0 }),
        });
        const next = (await response.json()) as Feedback;
        if (next && typeof next.score === "number") setFeedback(next);
      } catch {
        setFeedback(mock);
      } finally {
        setPending(false);
      }
      return;
    }
    if (teil.speaking) {
      const mock = assessSpeakingTask(teil.speaking, speaking);
      setFeedback(mock);
      setPending(true);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mockId: "goethe-b1-mock-1",
            teilId: teil.id,
            text: "",
            notes: speaking.notes,
            checklist: speaking.checklist,
            durationSec: speaking.durationSec,
          }),
        });
        const next = (await response.json()) as Feedback;
        if (next && typeof next.score === "number") setFeedback(next);
      } catch {
        setFeedback(mock);
      } finally {
        setPending(false);
      }
      return;
    }
    setFeedback(scoreObjectiveTeil(teil, answers));
  }

  const clips = [
    ...(teil.exampleStimulus?.kind === "audio" ? [teil.exampleStimulus] : []),
    ...teil.stimuli.filter((stimulus) => stimulus.kind === "audio"),
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap gap-2">
          <SkillBadge skill={module.skill} />
          <Badge>Beispieldaten</Badge>
          <Badge>Training</Badge>
        </div>
        <h1 className="mt-3 text-h1 font-semibold">
          Teil {teil.number} · {teil.title}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{teil.instruction}</p>
        <p className="mt-2 text-small text-muted">Im Training darfst du Texte erneut abspielen. Die Lösung kommt direkt nach dem Abgeben.</p>
      </div>

      {clips.map((stimulus) => {
        if (stimulus.kind !== "audio") return null;
        const body = audioManifest.clips[stimulus.audio.id]?.src;
        const situation = audioManifest.clips[`${stimulus.audio.id}__situation`]?.src;
        return (
          <Card key={stimulus.id} className="space-y-2 p-4">
            <p className="text-small font-semibold">{stimulus.audio.situation || "Hörtext"}</p>
            <p className="text-micro text-muted">
              In der Prüfung: {stimulus.audio.plays === 2 ? "zweimal" : "einmal"}
              {stimulus.audio.readSeconds ? ` · ${stimulus.audio.readSeconds} Sekunden zum Lesen` : ""}
            </p>
            {situation ? <audio controls src={situation} preload="none" className="w-full" /> : null}
            {body ? <audio controls src={body} preload="none" className="w-full" /> : <p className="text-small text-danger">Audiodatei fehlt.</p>}
          </Card>
        );
      })}

      <Stimuli teil={teil} />
      <SolvedExample teil={teil} />

      {teil.writing ? <SchreibenTeil teil={teil} text={text} onText={setText} /> : null}
      {teil.speaking ? (
        <SprechenTeil teil={teil} draft={speaking} topicId={topic} audioScope="uebung" onDraft={setSpeaking} onTopic={setTopic} />
      ) : null}
      {objective ? (
        <TeilQuestions
          teil={teil}
          answers={answers}
          onAnswer={feedback ? undefined : (itemId, optionId) => setAnswers((current) => ({ ...current, [itemId]: optionId }))}
          reveal={Boolean(feedback)}
          locked={Boolean(feedback)}
        />
      ) : null}

      {feedback && !objective ? (
        <Card className="space-y-2 p-4">
          <h2 className="text-h3 font-semibold">
            {feedback.score} / {feedback.maxScore}
          </h2>
          <p className="text-small text-muted">
            {feedback.summary}
            {pending ? " Die Einschätzung wird noch abgeglichen." : ""}
            {feedback.source === "gemini" ? " Einschätzung mit Gemini." : " Demo-Einschätzung."}
          </p>
          <ul className="space-y-2">
            {feedback.criteria?.map((criterion) => (
              <li key={criterion.id} className="text-small">
                <span className="font-semibold">
                  {criterion.label}: {criterion.points}/{criterion.max}.
                </span>{" "}
                {criterion.comment}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {!feedback ? (
        <Button onClick={() => void submit()}>Abgeben</Button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            setFeedback(null);
            setAnswers({});
          }}
        >
          Nochmal versuchen
        </Button>
      )}
    </div>
  );
}
