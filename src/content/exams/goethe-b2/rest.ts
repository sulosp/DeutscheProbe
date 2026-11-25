import type { Teil } from "@/lib/exam-model";
import { narrate } from "@/content/exams/factory";

const grid = (max: number) => [
  { id: "erfuellung", label: "Aufgabenerfüllung", max },
  { id: "kohaerenz", label: "Kohärenz", max },
  { id: "wortschatz", label: "Wortschatz", max },
  { id: "strukturen", label: "Strukturen", max },
];

export const b2Schreiben: Teil[] = [
  {
    id: "gb2-schreiben-1",
    number: 1,
    title: "Forumsbeitrag",
    maxRaw: 60,
    suggestedMinutes: 50,
    instruction: "Schreiben Sie einen Forumsbeitrag, etwa 150 Wörter. Gehen Sie auf alle vier Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      id: "gb2-schreiben-1",
      register: "halbformell, Forumsbeitrag",
      targetWords: 150,
      minWords: 120,
      maxWords: 190,
      situation: "In einem Forum steht: Sollten Städte die Innenstadt am Samstag für Autos sperren? Schreiben Sie Ihre Meinung.",
      bullets: ["Nennen Sie Ihre Meinung.", "Geben Sie Gründe.", "Nennen Sie einen Vorteil und einen Nachteil.", "Machen Sie einen Vorschlag."],
      signals: [
        ["meinung", "finde", "dafür", "dagegen", "stimme"],
        ["weil", "denn", "deshalb", "grund"],
        ["vorteil", "nachteil", "einerseits", "andererseits"],
        ["vorschlag", "sollte", "könnte", "besser"],
      ],
      rubric: grid(15),
    },
  },
  {
    id: "gb2-schreiben-2",
    number: 2,
    title: "Nachricht an die Leitung",
    maxRaw: 40,
    suggestedMinutes: 25,
    instruction: "Schreiben Sie eine halbformelle Nachricht, etwa 100 Wörter, an Ihre Abteilungsleitung.",
    stimuli: [],
    items: [],
    writing: {
      id: "gb2-schreiben-2",
      register: "halbformell",
      targetWords: 100,
      minWords: 80,
      maxWords: 130,
      situation: "Sie möchten für zwei Tage ins Homeoffice, weil zu Hause eine Reparatur stattfindet. Schreiben Sie an Frau Berg.",
      bullets: ["Bitten Sie um Homeoffice.", "Erklären Sie den Grund.", "Nennen Sie die Tage.", "Schlagen Sie vor, wie Sie erreichbar sind."],
      signals: [
        ["bitte", "homeoffice", "zu hause"],
        ["reparatur", "handwerker", "wohnung"],
        ["dienstag", "mittwoch", "donnerstag", "tag"],
        ["telefon", "mail", "erreichbar", "video"],
      ],
      rubric: grid(10),
    },
  },
];

export const b2Sprechen: Teil[] = [
  {
    id: "gb2-sprechen-1",
    number: 1,
    title: "Vortrag",
    maxRaw: 48,
    suggestedMinutes: 4,
    instruction: "Wählen Sie ein Thema und halten Sie einen Vortrag von etwa vier Minuten: Einleitung, Hauptteil, Schluss. Die Partnerin stellt danach eine Frage.",
    stimuli: [],
    items: [],
    speaking: {
      id: "gb2-sprechen-1",
      minutes: 4,
      situation: "Kurzer Vortrag. Wählen Sie Thema A oder Thema B.",
      prompts: ["Einleitung", "Hauptteil mit Beispiel", "Schluss"],
      topics: [
        { id: "stadt", title: "Thema A: Autofreie Innenstädte", prompts: ["Einleitung", "eigene Erfahrung", "Vorteile und Nachteile", "Schluss"] },
        { id: "arbeit", title: "Thema B: Homeoffice", prompts: ["Einleitung", "eigene Erfahrung", "Vorteile und Nachteile", "Schluss"] },
      ],
      checklist: ["Einleitung", "Beispiel", "Vor- oder Nachteil", "Schluss"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 16 },
        { id: "interaktion", label: "Interaktion", max: 8 },
        { id: "wortschatz", label: "Wortschatz", max: 12 },
        { id: "strukturen", label: "Strukturen", max: 12 },
      ],
      examinerAudio: narrate("gb2-s-t1", ["Teil 1. Wählen Sie ein Thema und halten Sie einen kurzen Vortrag. Danach stellt Ihre Partnerin eine Frage."]),
    },
  },
  {
    id: "gb2-sprechen-2",
    number: 2,
    title: "Diskussion",
    maxRaw: 36,
    suggestedMinutes: 5,
    instruction: "Diskutieren Sie etwa fünf Minuten. Sollen Betriebe eine Vier-Tage-Woche einführen? Argumentieren Sie und reagieren Sie.",
    stimuli: [],
    items: [],
    speaking: {
      id: "gb2-sprechen-2",
      minutes: 5,
      situation: "Diskussion: Vier-Tage-Woche in Betrieben, ja oder nein?",
      prompts: ["Nennen Sie Ihre Position.", "Geben Sie zwei Gründe.", "Gehen Sie auf die andere Position ein."],
      checklist: ["Position genannt", "Gründe genannt", "auf die Partnerin reagiert"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 12 },
        { id: "interaktion", label: "Interaktion", max: 6 },
        { id: "wortschatz", label: "Wortschatz", max: 9 },
        { id: "strukturen", label: "Strukturen", max: 9 },
      ],
      examinerAudio: narrate("gb2-s-t2", ["Teil 2. Diskutieren Sie: Sollten Betriebe eine Vier-Tage-Woche einführen?"]),
    },
  },
];
