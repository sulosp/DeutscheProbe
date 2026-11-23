import { percentOf, wordCount } from "@/lib/format";
import type { Draft, Feedback, Task } from "@/lib/types";

const CONNECTORS = [
  "und",
  "aber",
  "oder",
  "weil",
  "denn",
  "dass",
  "deshalb",
  "trotzdem",
  "obwohl",
  "außerdem",
  "zuerst",
  "danach",
  "dann",
  "jedoch",
  "dennoch",
];

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

export function scoreObjective(task: Task, answers: Record<string, string>): Feedback {
  const items = task.items ?? [];
  const reviews = items.map((item) => {
    const chosen = answers[item.id];
    return {
      id: item.id,
      correct: chosen === item.correct,
      chosen,
      explanation: item.explanation,
    };
  });
  const score = reviews.filter((item) => item.correct).length;
  const maxScore = items.length;
  const percent = percentOf(score, maxScore);
  return {
    source: "auto",
    score,
    maxScore,
    percent,
    summary:
      maxScore === 0
        ? "Für diese Aufgabe gibt es keine automatischen Punkte."
        : `${score} von ${maxScore} Punkten. ${percent >= 60 ? "Das liegt im Bereich, in dem viele Prüfungen als bestanden gelten." : "Sieh dir die Erklärungen an und übe den Teil noch einmal."}`,
    items: reviews,
    strengths: reviews.filter((item) => item.correct).length
      ? ["Richtig gelöste Aufgaben bleiben in der Auswertung sichtbar."]
      : [],
    improvements:
      percent < 100
        ? ["Lies die Erklärung bei jeder falschen Aufgabe und markiere das Schlüsselwort im Text."]
        : ["Wiederhole den Teil später mit einer neuen Aufgabe, sobald sie im Datenbestand liegt."],
  };
}

export function assessWriting(task: Task, text: string): Feedback {
  const brief = task.writing;
  const count = wordCount(text);
  const lower = text.toLowerCase();
  const signals = brief?.signals ?? [];
  const hits = signals.filter((signal) => lower.includes(signal.toLowerCase()));
  const coverage = signals.length === 0 ? 0 : hits.length / signals.length;
  const aufgabe = clamp(coverage * 8, 8);
  const min = brief?.minWords ?? 40;
  const max = brief?.maxWords ?? 80;
  const laenge =
    count === 0 ? 0 : count < min ? clamp((count / min) * 4, 4) : count > max + 50 ? 3 : 4;
  const connectorHits = CONNECTORS.filter((word) => new RegExp(`\\b${word}\\b`, "i").test(lower)).length;
  const kohaerenz = clamp(connectorHits + (text.includes("\n") ? 1 : 0), 4);
  const unique = new Set(
    lower
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zäöüß]/g, ""))
      .filter((word) => word.length > 2),
  ).size;
  const wortschatz = count === 0 ? 0 : clamp(unique / 8, 4);
  const form = clamp((/[.!?]$/.test(text.trim()) ? 2 : 0) + (text !== lower ? 2 : 0), 4);
  const score = clamp(aufgabe + laenge + kohaerenz + wortschatz, 20);
  const percent = percentOf(score, 20);
  return {
    source: "mock",
    score,
    maxScore: 20,
    percent,
    summary: `${count} Wörter. Das ist eine automatische Demo-Einschätzung, keine Lehrkraft und keine offizielle Note.`,
    criteria: [
      {
        id: "aufgabe",
        label: "Aufgabenerfüllung",
        points: aufgabe,
        max: 8,
        comment:
          hits.length === 0
            ? "Die Leitpunkte aus der Aufgabe sind im Text noch kaum wiederzuerkennen."
            : `Erkannt: ${hits.join(", ")}.`,
      },
      {
        id: "kohaerenz",
        label: "Kohärenz",
        points: kohaerenz,
        max: 4,
        comment:
          connectorHits > 1
            ? "Es gibt Verbindungswörter zwischen den Sätzen."
            : "Verbinde die Sätze mit weil, deshalb, aber oder außerdem.",
      },
      {
        id: "wortschatz",
        label: "Wortschatz",
        points: wortschatz,
        max: 4,
        comment: `${unique} verschiedene Wörter. ${count < min ? `Ziel sind etwa ${min}–${max} Wörter.` : "Der Umfang passt ungefähr zum Ziel."}`,
      },
      {
        id: "form",
        label: "Form",
        points: form,
        max: 4,
        comment: form >= 2 ? "Großschreibung und Satzzeichen sind ansatzweise da." : "Achte auf Großbuchstaben und einen Punkt am Satzende.",
      },
    ],
    strengths: percent >= 60 ? ["Der Text geht auf die Situation ein."] : [],
    improvements: [
      count < min ? `Schreibe mindestens etwa ${min} Wörter.` : "Prüfe, ob jeder Leitpunkt einen eigenen Satz hat.",
      "Schließe mit einem passenden Gruß für das genannte Register.",
    ],
  };
}

export function assessSpeaking(task: Task, draft: Pick<Draft, "checklist" | "notes">, durationSec: number): Feedback {
  const checklist = task.speaking?.checklist ?? [];
  const done = checklist.filter((item) => draft.checklist.includes(item)).length;
  const coverage = checklist.length === 0 ? 0 : done / checklist.length;
  const aufgabe = clamp(coverage * 8, 8);
  const target = Math.max(30, task.minutes * 60 * 0.4);
  const fluessig =
    durationSec <= 0 ? 0 : clamp((Math.min(durationSec, target) / target) * 6, 6);
  const notes = wordCount(draft.notes);
  const interaktion = clamp((notes >= 8 ? 3 : notes > 0 ? 1 : 0) + (done > 0 ? 1 : 0), 4);
  const score = clamp(aufgabe + fluessig + interaktion, 20);
  const percent = percentOf(score, 20);
  return {
    source: "mock",
    score,
    maxScore: 20,
    percent,
    summary:
      durationSec > 0
        ? `Aufnahme etwa ${durationSec} Sekunden. Demo-Einschätzung ohne Lehrkraft.`
        : "Ohne Aufnahme zählt nur die Stichwortliste. Nimm beim nächsten Mal wirklich auf.",
    criteria: [
      {
        id: "aufgabe",
        label: "Aufgabenerfüllung",
        points: aufgabe,
        max: 8,
        comment: `${done} von ${checklist.length} Stichpunkten markiert.`,
      },
      {
        id: "fluessigkeit",
        label: "Sprechzeit",
        points: fluessig,
        max: 6,
        comment:
          durationSec > 0
            ? "Es liegt eine Aufnahme vor. Die Demo bewertet die Dauer, nicht die Aussprache."
            : "Es wurde nichts aufgenommen.",
      },
      {
        id: "interaktion",
        label: "Notizen",
        points: interaktion,
        max: 4,
        comment:
          notes > 0
            ? "Die Notizen helfen der Einschätzung, ersetzen aber kein Transkript."
            : "Schreibe nach dem Sprechen kurz auf, was du gesagt hast.",
      },
    ],
    strengths: done > 0 ? ["Du hast die Aufgabe in Stichpunkte zerlegt."] : [],
    improvements: [
      durationSec < 20 ? "Sprich mindestens einen halben Minute am Stück." : "Reagiere auf die Sätze der Partnerin oder des Partners.",
      "Nenne zu jedem Stichpunkt ein konkretes Beispiel.",
    ],
  };
}

export function feedbackFromDraft(task: Task, draft: Draft, durationSec: number): Feedback {
  if (task.writing) return assessWriting(task, draft.text);
  if (task.speaking) return assessSpeaking(task, draft, durationSec);
  return scoreObjective(task, draft.answers);
}
