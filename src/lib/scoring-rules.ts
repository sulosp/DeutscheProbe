import { percentOf, wordCount } from "@/lib/format";
import { answerMatches, itemOptions } from "@/lib/exam-model";
import type { ExamModule, MockExam, RubricCriterion, SpeakingTask, Teil, WritingTask } from "@/lib/exam-model";
import type { Feedback, Skill } from "@/lib/types";

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
  "dadurch",
];

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

/** Goethe B1/B2 Lesen and Hören: 30 raw points scale onto 100. 18 raw = 60. */
export function convertMesspunkte(raw: number, maxRaw = 30) {
  if (maxRaw <= 0) return 0;
  return Math.round((raw * 100) / maxRaw);
}

export function scaleGoetheA2(raw: number) {
  return Math.round(raw * 1.25 * 2) / 2;
}

export type A2ModulePoints = { lesen: number; hoeren: number; schreiben: number; sprechen: number };

/** Pass needs 60/100 overall, at least 45/75 written and 15/25 oral. */
export function passGoetheA2(modules: A2ModulePoints) {
  const written = modules.lesen + modules.hoeren + modules.schreiben;
  const oral = modules.sprechen;
  const total = written + oral;
  return {
    total,
    written,
    oral,
    passed: total >= 60 && written >= 45 && oral >= 15,
  };
}

export type A1Raw = { hoeren: number; lesen: number; schreiben: number; sprechen: number };

/** Raw 15+15+15 written → 75, raw 15 oral → 25. Pass at 60/100. */
export function passGoetheA1(raw: A1Raw) {
  const writtenRaw = raw.hoeren + raw.lesen + raw.schreiben;
  const written = Math.round((writtenRaw / 45) * 75);
  const oral = Math.round((raw.sprechen / 15) * 25);
  const total = written + oral;
  return { written, oral, total, passed: total >= 60 };
}

export type Telc300Parts = {
  lesen: number;
  sprachbausteine: number;
  hoeren: number;
  schreiben: number;
  sprechen: number;
};

const TELC_300_GRADES: [number, string][] = [
  [270, "sehr gut"],
  [240, "gut"],
  [210, "befriedigend"],
  [180, "ausreichend"],
];

/** Written pass is 135/225 and oral pass is 45/75. Both are required. */
export function passTelc300(parts: Telc300Parts) {
  const written = parts.lesen + parts.sprachbausteine + parts.hoeren + parts.schreiben;
  const oral = parts.sprechen;
  const total = written + oral;
  const passed = written >= 135 && oral >= 45;
  const band = TELC_300_GRADES.find(([min]) => total >= min);
  return {
    written,
    oral,
    total,
    passed,
    grade: passed ? (band?.[1] ?? "ausreichend") : "teilgenommen",
  };
}

export type Telc60Parts = { hoeren: number; lesen: number; schreiben: number; sprechen: number };

export function passTelc60(parts: Telc60Parts) {
  const total = parts.hoeren + parts.lesen + parts.schreiben + parts.sprechen;
  const grades: [number, string][] = [
    [54, "sehr gut"],
    [48, "gut"],
    [42, "befriedigend"],
    [36, "ausreichend"],
  ];
  const passed = total >= 36;
  const band = grades.find(([min]) => total >= min);
  return { total, passed, grade: passed ? (band?.[1] ?? "ausreichend") : "teilgenommen" };
}

export type TeilScore = {
  teilId: string;
  title: string;
  number: number;
  raw: number;
  maxRaw: number;
  skill: Skill;
};

export type ModuleScore = {
  moduleId: string;
  skill: Skill;
  title: string;
  raw: number;
  maxRaw: number;
  points: number;
  maxPoints: number;
  passed: boolean;
  teile: TeilScore[];
  seconds: number;
};

export type ExamScore = {
  modules: ModuleScore[];
  passed: boolean;
  rule: MockExam["scoring"]["kind"];
  percent: number;
  total?: number;
  maxTotal?: number;
  written?: number;
  oral?: number;
  grade?: string;
  headline: string;
  detail: string;
};

function objectiveRaw(teil: Teil, answers: Record<string, string>) {
  return teil.items.reduce((sum, item) => (answerMatches(item.correct, answers[item.id]) ? sum + item.points : sum), 0);
}

export function scoreObjectiveTeil(teil: Teil, answers: Record<string, string>): Feedback {
  const reviews = teil.items.map((item) => ({
    id: item.id,
    correct: answerMatches(item.correct, answers[item.id]),
    chosen: answers[item.id],
    explanation: item.explanation,
  }));
  const score = reviews.filter((item) => item.correct).length;
  const maxScore = teil.items.length;
  const percent = percentOf(score, maxScore);
  return {
    source: "auto",
    score,
    maxScore,
    percent,
    summary:
      maxScore === 0
        ? "Für diesen Teil gibt es keine automatischen Punkte."
        : `${score} von ${maxScore} Punkten.`,
    items: reviews,
  };
}

function connectorCount(text: string) {
  const lower = text.toLowerCase();
  return CONNECTORS.filter((word) => new RegExp(`\\b${word}\\b`, "i").test(lower)).length;
}

function uniqueWords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zäöüß-]/gi, ""))
      .filter((word) => word.length > 2),
  ).size;
}

export function assessWritingTask(task: WritingTask, text: string): Feedback {
  const count = wordCount(text);
  const lower = text.toLowerCase();
  const hits = task.signals.map((group) => group.some((signal) => lower.includes(signal.toLowerCase())));
  const covered = hits.filter(Boolean).length;
  const rubric = task.rubric;
  const byId = Object.fromEntries(rubric.map((criterion) => [criterion.id, criterion])) as Record<string, RubricCriterion | undefined>;
  const erfuellungMax = byId.erfuellung?.max ?? rubric[0]?.max ?? 10;
  const needed = task.requiredBullets ?? task.signals.length;
  const coverage = needed === 0 ? 0 : Math.min(1, covered / needed);
  let erfuellung = clamp(coverage * erfuellungMax, erfuellungMax);
  if (count === 0) erfuellung = 0;

  const emptyTask = erfuellung === 0;
  const lengthRatio = task.targetWords === 0 ? 0 : Math.min(count / task.targetWords, 1.15);
  const kohaerenzMax = byId.kohaerenz?.max ?? 10;
  const wortschatzMax = byId.wortschatz?.max ?? 10;
  const strukturenMax = byId.strukturen?.max ?? 10;
  const connectors = connectorCount(text);
  const sentences = text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
  const kohaerenz = emptyTask ? 0 : clamp((connectors / 4) * kohaerenzMax * lengthRatio, kohaerenzMax);
  const wortschatz = emptyTask ? 0 : clamp((uniqueWords(text) / 35) * wortschatzMax, wortschatzMax);
  const formBits = (text !== lower ? 1 : 0) + (sentences >= 3 ? 1 : sentences > 0 ? 0.5 : 0) + (/[.!?]$/.test(text.trim()) ? 0.5 : 0);
  const strukturen = emptyTask ? 0 : clamp((formBits / 2.5) * strukturenMax * Math.max(lengthRatio, 0.4), strukturenMax);

  const languageRatio = emptyTask || count === 0 ? 0 : Math.min(1, Math.min(connectors, 4) / 4 * 0.4 + Math.min(uniqueWords(text) / 30, 1) * 0.35 + Math.min(formBits / 2.5, 1) * 0.25);
  const textsorte = emptyTask ? 0 : /liebe|hallo|sehr geehrte|mit freundlichen|viele grüße|liebe grüße|gruß/i.test(lower) ? 1 : 0.4;
  const points: Record<string, number> = {
    erfuellung,
    kohaerenz,
    wortschatz,
    strukturen,
    sprache: clamp(languageRatio * (byId.sprache?.max ?? 0), byId.sprache?.max ?? 0),
    textsorte: clamp(textsorte * (byId.textsorte?.max ?? 0), byId.textsorte?.max ?? 0),
  };
  const criteria = rubric.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    points: clamp(points[criterion.id] ?? languageRatio * criterion.max, criterion.max),
    max: criterion.max,
    comment: commentFor(criterion.id, { covered, total: task.signals.length, count, target: task.targetWords, connectors, emptyTask }),
  }));
  const score = criteria.reduce((sum, criterion) => sum + criterion.points, 0);
  const maxScore = criteria.reduce((sum, criterion) => sum + criterion.max, 0);
  return {
    source: "mock",
    score,
    maxScore,
    percent: percentOf(score, maxScore),
    summary: emptyTask
      ? "Die Aufgabenerfüllung ist nicht erkennbar. In der Prüfung wäre diese Aufgabe dann 0 Punkte. Das ist eine Demo-Einschätzung, keine Lehrkraft."
      : `${count} Wörter, Ziel etwa ${task.targetWords}. Demo-Einschätzung nach B1-Kriterien, keine offizielle Note.`,
    criteria,
    strengths: covered > 0 ? [`${covered} von ${task.signals.length} Inhaltspunkten sind im Text wiederzuerkennen.`] : [],
    improvements: [
      count < task.minWords ? `Schreiben Sie mindestens etwa ${task.minWords} Wörter.` : "Prüfen Sie, ob jeder Inhaltspunkt einen eigenen Satz hat.",
      task.register.toLowerCase().includes("informell")
        ? "Passen Anrede und Gruß zum informellen Register?"
        : "Passen Anrede und Gruß zum halbformellen Register?",
    ],
  };
}

function commentFor(
  id: string,
  info: { covered: number; total: number; count: number; target: number; connectors: number; emptyTask: boolean },
) {
  if (info.emptyTask && id === "erfuellung") return "Die Leitpunkte sind im Text nicht zu erkennen.";
  if (info.emptyTask) return "Ohne Aufgabenerfüllung gibt es für diese Aufgabe keine weiteren Punkte.";
  if (id === "erfuellung") return `${info.covered} von ${info.total} Inhaltspunkten erkannt.`;
  if (id === "kohaerenz") {
    return info.connectors > 1 ? "Es gibt Verbindungswörter zwischen den Sätzen." : "Verbinden Sie die Sätze mit weil, deshalb, aber oder außerdem.";
  }
  if (id === "wortschatz") return `${info.count} Wörter, Ziel etwa ${info.target}.`;
  return "Großschreibung, Satzzahl und Satzzeichen fließen in die Demo ein, nicht jede Grammatikform.";
}

export function assessSpeakingTask(
  task: SpeakingTask,
  draft: { notes: string; checklist: string[]; durationSec: number },
): Feedback {
  const done = task.checklist.filter((item) => draft.checklist.includes(item)).length;
  const coverage = task.checklist.length === 0 ? 0 : done / task.checklist.length;
  const byId = Object.fromEntries(task.rubric.map((criterion) => [criterion.id, criterion]));
  const erfuellungMax = byId.erfuellung?.max ?? 8;
  const interaktionMax = byId.interaktion?.max ?? 4;
  const wortschatzMax = byId.wortschatz?.max ?? 8;
  const strukturenMax = byId.strukturen?.max ?? 8;
  const erfuellung = clamp(coverage * erfuellungMax, erfuellungMax);
  const notes = wordCount(draft.notes);
  const interaktion = clamp((notes >= 12 ? 0.6 : notes > 0 ? 0.3 : 0) * interaktionMax + (done > 0 ? 0.4 : 0) * interaktionMax, interaktionMax);
  const target = Math.max(30, task.minutes * 60 * 0.45);
  const spoken = draft.durationSec > 0 ? Math.min(draft.durationSec / target, 1) : 0;
  const wortschatz = clamp(((notes > 0 ? uniqueWords(draft.notes) / 20 : 0) * 0.5 + spoken * 0.5) * wortschatzMax, wortschatzMax);
  const strukturen = clamp(spoken * strukturenMax, strukturenMax);
  const points: Record<string, number> = { erfuellung, interaktion, wortschatz, strukturen };
  const criteria = task.rubric.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    points: clamp(points[criterion.id] ?? 0, criterion.max),
    max: criterion.max,
    comment:
      criterion.id === "erfuellung"
        ? `${done} von ${task.checklist.length} Stichpunkten markiert.`
        : criterion.id === "interaktion"
          ? notes > 0
            ? "Die Notizen zeigen, dass Sie auf die Situation eingehen."
            : "Notieren Sie kurz, was Sie gesagt oder gefragt haben."
          : draft.durationSec > 0
            ? `Aufnahme etwa ${draft.durationSec} Sekunden. Die Demo hört die Aufnahme nicht mit.`
            : "Es liegt keine Aufnahme vor.",
  }));
  const score = criteria.reduce((sum, criterion) => sum + criterion.points, 0);
  const maxScore = criteria.reduce((sum, criterion) => sum + criterion.max, 0);
  return {
    source: "mock",
    score,
    maxScore,
    percent: percentOf(score, maxScore),
    summary:
      draft.durationSec > 0
        ? `Aufnahme etwa ${draft.durationSec} Sekunden. Demo-Einschätzung nach B1-Kriterien, keine Lehrkraft.`
        : "Ohne Aufnahme zählen Stichpunkte und Notizen. Nehmen Sie beim nächsten Mal auf.",
    criteria,
    strengths: done > 0 ? ["Die Aufgabe ist in Stichpunkte zerlegt."] : [],
    improvements: [
      draft.durationSec < 20 ? "Sprechen Sie mindestens eine halbe Minute am Stück." : "Reagieren Sie auf die Frage der Partnerin oder des Partners.",
      "Nennen Sie zu jedem Stichpunkt ein konkretes Beispiel.",
    ],
  };
}

export function assessPronunciation(max: number, durationSec: number): Feedback {
  const points = durationSec <= 0 ? 0 : clamp(Math.min(durationSec / 90, 1) * max * 0.75, max);
  return {
    source: "mock",
    score: points,
    maxScore: max,
    percent: percentOf(points, max),
    summary:
      durationSec > 0
        ? "Aussprache wird in der Demo nur daran erkannt, dass eine Aufnahme vorliegt. Eine Lehrkraft hört die Laute."
        : "Ohne Aufnahme gibt es für die Aussprache keine Punkte.",
    criteria: [
      {
        id: "aussprache",
        label: "Aussprache",
        points,
        max,
        comment: durationSec > 0 ? `Gesamte Aufnahme etwa ${durationSec} Sekunden.` : "Keine Aufnahme.",
      },
    ],
  };
}

function productiveTeilScore(teil: Teil, feedback: Feedback | undefined, answers: Record<string, string>, writing: Record<string, string>, speaking: Record<string, { notes: string; checklist: string[]; durationSec: number }>) {
  if (feedback) return { raw: feedback.score, maxRaw: feedback.maxScore };
  if (teil.writing) {
    const result = assessWritingTask(teil.writing, writing[teil.id] ?? "");
    return { raw: result.score, maxRaw: result.maxScore };
  }
  if (teil.speaking) {
    const draft = speaking[teil.id] ?? { notes: "", checklist: [], durationSec: 0 };
    const result = assessSpeakingTask(teil.speaking, draft);
    return { raw: result.score, maxRaw: result.maxScore };
  }
  return { raw: objectiveRaw(teil, answers), maxRaw: teil.maxRaw };
}

export function scoreModule(
  module: ExamModule,
  input: {
    answers: Record<string, string>;
    writing: Record<string, string>;
    speaking: Record<string, { notes: string; checklist: string[]; durationSec: number }>;
    feedback?: Record<string, Feedback>;
    seconds?: number;
    passAt?: number;
  },
): ModuleScore {
  const teile: TeilScore[] = module.teile.map((teil) => {
    const scored = productiveTeilScore(teil, input.feedback?.[teil.id], input.answers, input.writing, input.speaking);
    return {
      teilId: teil.id,
      title: teil.title,
      number: teil.number,
      raw: scored.raw,
      maxRaw: scored.maxRaw,
      skill: module.skill,
    };
  });
  let raw = teile.reduce((sum, teil) => sum + teil.raw, 0);
  let maxRaw = teile.reduce((sum, teil) => sum + teil.maxRaw, 0);
  const pronunciation = module.moduleRubric?.find((criterion) => criterion.id === "aussprache");
  if (pronunciation) {
    const duration = Object.values(input.speaking).reduce((sum, draft) => sum + (draft.durationSec || 0), 0);
    const spoken = input.feedback?.aussprache ?? assessPronunciation(pronunciation.max, duration);
    raw += spoken.score;
    maxRaw += spoken.maxScore;
    teile.push({
      teilId: `${module.id}-aussprache`,
      title: "Aussprache",
      number: module.teile.length + 1,
      raw: spoken.score,
      maxRaw: spoken.maxScore,
      skill: module.skill,
    });
  }
  const points =
    module.skill === "lesen" || module.skill === "hoeren" ? convertMesspunkte(raw, maxRaw || 30) : clamp(raw, 100);
  const maxPoints = 100;
  const passAt = input.passAt ?? 60;
  return {
    moduleId: module.id,
    skill: module.skill,
    title: module.title,
    raw,
    maxRaw,
    points,
    maxPoints,
    passed: points >= passAt,
    teile,
    seconds: input.seconds ?? 0,
  };
}

function rawBySkill(
  exam: MockExam,
  input: {
    answers: Record<string, string>;
    writing: Record<string, string>;
    speaking: Record<string, { notes: string; checklist: string[]; durationSec: number }>;
    feedback?: Record<string, Feedback>;
    secondsByModule?: Record<string, number>;
  },
) {
  return exam.modules.map((module) => {
const teile: TeilScore[] = [];
  const grouped = new Map<string, TeilScore[]>();
  for (const teil of module.teile) {
    const scored = productiveTeilScore(teil, input.feedback?.[teil.id], input.answers, input.writing, input.speaking);
    const row: TeilScore = { teilId: teil.id, title: teil.title, number: teil.number, raw: scored.raw, maxRaw: scored.maxRaw, skill: module.skill };
    if (teil.alternativeGroup) {
      const list = grouped.get(teil.alternativeGroup) ?? [];
      list.push(row);
      grouped.set(teil.alternativeGroup, list);
    } else {
      teile.push(row);
    }
  }
  for (const list of grouped.values()) {
    const best = list.reduce((left, right) => (left.raw >= right.raw ? left : right));
    teile.push({ ...best, maxRaw: Math.max(...list.map((entry) => entry.maxRaw)) });
  }
  let raw = teile.reduce((sum, teil) => sum + teil.raw, 0);
  let maxRaw = teile.reduce((sum, teil) => sum + teil.maxRaw, 0);
    const pronunciation = module.moduleRubric?.find((criterion) => criterion.id === "aussprache");
    if (pronunciation) {
      const duration = Object.values(input.speaking).reduce((sum, draft) => sum + (draft.durationSec || 0), 0);
      const spoken = input.feedback?.aussprache ?? assessPronunciation(pronunciation.max, duration);
      raw += spoken.score;
      maxRaw += spoken.maxScore;
      teile.push({
        teilId: `${module.id}-aussprache`,
        title: "Aussprache",
        number: module.teile.length + 1,
        raw: spoken.score,
        maxRaw: spoken.maxScore,
        skill: module.skill,
      });
    }
    return { module, teile, raw, maxRaw, seconds: input.secondsByModule?.[module.id] ?? 0 };
  });
}

function asModule(
  entry: ReturnType<typeof rawBySkill>[number],
  points: number,
  maxPoints: number,
  passed: boolean,
): ModuleScore {
  return {
    moduleId: entry.module.id,
    skill: entry.module.skill,
    title: entry.module.title,
    raw: entry.raw,
    maxRaw: entry.maxRaw,
    points,
    maxPoints,
    passed,
    teile: entry.teile,
    seconds: entry.seconds,
  };
}

function skillRaw(rows: ReturnType<typeof rawBySkill>, skill: string) {
  return rows.find((entry) => entry.module.skill === skill)?.raw ?? 0;
}

export function scoreMockExam(
  exam: MockExam,
  input: {
    answers: Record<string, string>;
    writing: Record<string, string>;
    speaking: Record<string, { notes: string; checklist: string[]; durationSec: number }>;
    feedback?: Record<string, Feedback>;
    secondsByModule?: Record<string, number>;
  },
): ExamScore {
  if (exam.scoring.kind === "goethe-modular") {
    const passAt = exam.scoring.pass;
    const modules = exam.modules.map((module) =>
      scoreModule(module, { ...input, seconds: input.secondsByModule?.[module.id] ?? 0, passAt }),
    );
    const percent = Math.round(modules.reduce((sum, module) => sum + module.points, 0) / Math.max(modules.length, 1));
    const passed = modules.every((module) => module.passed);
    return {
      modules,
      passed,
      rule: exam.scoring.kind,
      percent,
      headline: passed ? "Alle Module bestanden" : "Noch nicht alle Module bestanden",
      detail: "Jedes Modul gilt ab 60 von 100 Punkten als bestanden. Lesen und Hören rechnen 30 Rohpunkte auf 100 um. Das ist eine Übung, keine offizielle Bewertung.",
    };
  }

  const rows = rawBySkill(exam, input);
  if (exam.scoring.kind === "goethe-a1") {
    const result = passGoetheA1({
      hoeren: skillRaw(rows, "hoeren"),
      lesen: skillRaw(rows, "lesen"),
      schreiben: skillRaw(rows, "schreiben"),
      sprechen: skillRaw(rows, "sprechen"),
    });
    return {
      modules: rows.map((entry) => asModule(entry, entry.raw, entry.maxRaw, false)),
      passed: result.passed,
      rule: exam.scoring.kind,
      percent: result.total,
      total: result.total,
      maxTotal: 100,
      written: result.written,
      oral: result.oral,
      headline: result.passed ? "Bestanden" : "Nicht bestanden",
      detail: `Schriftlich ${result.written} von 75, mündlich ${result.oral} von 25, gesamt ${result.total} von 100. Bestanden ab 60. Das ist eine Übung, keine offizielle Bewertung.`,
    };
  }
  if (exam.scoring.kind === "goethe-a2") {
    const lesen = scaleGoetheA2(skillRaw(rows, "lesen"));
    const hoeren = scaleGoetheA2(skillRaw(rows, "hoeren"));
    const schreiben = scaleGoetheA2(skillRaw(rows, "schreiben"));
    const sprechen = skillRaw(rows, "sprechen");
    const result = passGoetheA2({ lesen, hoeren, schreiben, sprechen });
    const scaled: Record<string, number> = { lesen, hoeren, schreiben, sprechen };
    return {
      modules: rows.map((entry) => asModule(entry, scaled[entry.module.skill] ?? entry.raw, 25, false)),
      passed: result.passed,
      rule: exam.scoring.kind,
      percent: Math.round(result.total),
      total: result.total,
      maxTotal: 100,
      written: result.written,
      oral: result.oral,
      headline: result.passed ? "Bestanden" : "Nicht bestanden",
      detail: `Gesamt ${result.total} von 100, schriftlich ${result.written} von 75, mündlich ${result.oral} von 25. Bestanden nur mit mindestens 60 gesamt, 45 schriftlich und 15 mündlich.`,
    };
  }
  if (exam.scoring.kind === "telc-60") {
    const result = passTelc60({
      hoeren: skillRaw(rows, "hoeren"),
      lesen: skillRaw(rows, "lesen"),
      schreiben: skillRaw(rows, "schreiben"),
      sprechen: skillRaw(rows, "sprechen"),
    });
    return {
      modules: rows.map((entry) => asModule(entry, entry.raw, entry.maxRaw, false)),
      passed: result.passed,
      rule: exam.scoring.kind,
      percent: Math.round((result.total / 60) * 100),
      total: result.total,
      maxTotal: 60,
      grade: result.grade,
      headline: result.passed ? result.grade : "Nicht bestanden",
      detail: `Gesamt ${result.total} von 60. Note: ${result.grade}. Bestanden ab 36.`,
    };
  }
  const result = passTelc300({
    lesen: skillRaw(rows, "lesen"),
    sprachbausteine: skillRaw(rows, "sprachbausteine"),
    hoeren: skillRaw(rows, "hoeren"),
    schreiben: skillRaw(rows, "schreiben"),
    sprechen: skillRaw(rows, "sprechen"),
  });
  return {
    modules: rows.map((entry) => asModule(entry, entry.raw, entry.maxRaw, false)),
    passed: result.passed,
    rule: "telc-300",
    percent: Math.round((result.total / 300) * 100),
    total: result.total,
    maxTotal: 300,
    written: result.written,
    oral: result.oral,
    grade: result.grade,
    headline: result.passed ? result.grade : "Nicht bestanden",
    detail: `Schriftlich ${result.written} von 225, mündlich ${result.oral} von 75, gesamt ${result.total} von 300. Bestanden ab 135 schriftlich und 45 mündlich. Note: ${result.grade}.`,
  };
}

export function weakestTeil(score: ExamScore) {
  const teile = score.modules.flatMap((module) =>
    module.teile
      .filter((teil) => teil.maxRaw > 0 && !teil.teilId.endsWith("aussprache"))
      .map((teil) => ({ ...teil, ratio: teil.raw / teil.maxRaw, moduleId: module.moduleId })),
  );
  return teile.sort((a, b) => a.ratio - b.ratio)[0] ?? null;
}

export function optionLabel(teil: Teil, itemId: string, optionId: string | undefined) {
  const item = teil.items.find((entry) => entry.id === itemId) ?? teil.exampleItems?.find((entry) => entry.id === itemId) ?? teil.example;
  if (!item || !optionId) return optionId ?? "keine";
  return itemOptions(item, teil).find((option) => option.id === optionId)?.label ?? optionId;
}
