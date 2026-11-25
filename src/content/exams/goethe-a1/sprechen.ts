import type { Teil } from "@/lib/exam-model";
import { dialogue, narrate } from "@/content/exams/factory";
import { NARRATOR, TANJA } from "@/content/exams/voices";

export const a1Sprechen: Teil[] = [
  {
    id: "ga1-sprechen-1",
    number: 1,
    title: "Sich vorstellen",
    maxRaw: 3,
    suggestedMinutes: 3,
    instruction: "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. Buchstabieren Sie einen Namen und sagen Sie eine Zahl.",
    stimuli: [],
    items: [],
    speaking: {
      id: "ga1-sprechen-1",
      minutes: 3,
      situation: "Die Prüfung beginnt. Sie stellen sich der Gruppe vor.",
      prompts: ["Name und Alter", "Land und Wohnort", "Sprachen", "Beruf oder Kurs", "Hobby", "Einen Namen buchstabieren", "Eine Zahl sagen"],
      checklist: ["Name genannt", "Wohnort oder Land genannt", "Hobby genannt"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 2 },
        { id: "interaktion", label: "Reaktion", max: 1 },
      ],
      examinerAudio: narrate("ga1-s-t1", ["Teil 1. Bitte stellen Sie sich vor. Sagen Sie auch eine Zahl und buchstabieren Sie einen Namen."]),
    },
  },
  {
    id: "ga1-sprechen-2",
    number: 2,
    title: "Fragen und antworten",
    maxRaw: 6,
    suggestedMinutes: 4,
    instruction: "Thema: Wochenende. Fragen Sie und antworten Sie. Zwei Runden.",
    stimuli: [],
    items: [],
    speaking: {
      id: "ga1-sprechen-2",
      minutes: 4,
      situation: "Sie sprechen mit einer Partnerin über das Wochenende.",
      prompts: ["Was machen Sie am Samstag?", "Wo essen Sie gern?", "Treiben Sie Sport?", "Was machen Sie am Sonntag?"],
      partnerLines: [{ name: "Nora", text: "Was machst du am Wochenende?" }],
      checklist: ["eine Frage gestellt", "auf die Partnerin geantwortet", "ein Beispiel genannt"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 4 },
        { id: "interaktion", label: "Interaktion", max: 2 },
      ],
      examinerAudio: dialogue("ga1-s-t2", [NARRATOR, TANJA], [
        { who: NARRATOR, text: "Teil 2. Sie fragen und antworten zum Thema Wochenende." },
        { who: TANJA, text: "Was machst du am Wochenende?" },
      ]),
    },
  },
  {
    id: "ga1-sprechen-3",
    number: 3,
    title: "Eine Bitte",
    maxRaw: 6,
    suggestedMinutes: 4,
    instruction: "Formulieren Sie eine Bitte und reagieren Sie auf die Bitte der Partnerin. Zwei Runden.",
    stimuli: [
      { kind: "text", id: "ga1-card", title: "Ihre Karte", body: "Sie stehen vor einem geschlossenen Fenster. Bitten Sie, das Fenster zu öffnen.", genre: "sign" },
    ],
    items: [],
    speaking: {
      id: "ga1-sprechen-3",
      minutes: 4,
      situation: "Sie formulieren eine höfliche Bitte und reagieren auf eine Bitte.",
      prompts: ["Bitten Sie, das Fenster zu öffnen.", "Reagieren Sie, wenn Nora um ein Glas Wasser bittet."],
      partnerLines: [{ name: "Nora", text: "Kannst du mir bitte ein Glas Wasser geben?" }],
      checklist: ["Bitte formuliert", "auf die Bitte reagiert"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 4 },
        { id: "interaktion", label: "Interaktion", max: 2 },
      ],
      examinerAudio: dialogue("ga1-s-t3", [NARRATOR, TANJA], [
        { who: NARRATOR, text: "Teil 3. Formulieren Sie eine Bitte und reagieren Sie." },
        { who: TANJA, text: "Kannst du mir bitte ein Glas Wasser geben?" },
      ]),
    },
  },
];
