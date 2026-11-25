import type { Teil } from "@/lib/exam-model";
import { narrate } from "@/content/exams/factory";

const write = (): Teil["writing"] => ({
  id: "",
  register: "informell",
  targetWords: 30,
  minWords: 20,
  maxWords: 45,
  situation: "",
  bullets: [],
  signals: [],
  rubric: [
    { id: "erfuellung", label: "Aufgabenerfüllung", max: 5 },
    { id: "sprache", label: "Sprache", max: 5 },
  ],
});

export const a2Schreiben: Teil[] = [
  {
    id: "ga2-schreiben-1",
    number: 1,
    title: "Nachricht",
    maxRaw: 10,
    suggestedMinutes: 12,
    instruction: "Schreiben Sie eine kurze Nachricht, 20 bis 30 Wörter. Gehen Sie auf alle drei Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      ...write()!,
      id: "ga2-schreiben-1",
      targetWords: 25,
      minWords: 20,
      maxWords: 35,
      situation: "Sie können morgen nicht zum Sprachcafé kommen. Schreiben Sie eine Nachricht an Ihre Freundin Lea.",
      bullets: ["Sagen Sie, dass Sie nicht kommen können.", "Nennen Sie den Grund.", "Schlagen Sie einen neuen Termin vor."],
      signals: [
        ["nicht kommen", "leider", "kann nicht"],
        ["arbeit", "krank", "termin", "zug"],
        ["dienstag", "nächst", "anders", "verschieb"],
      ],
    },
  },
  {
    id: "ga2-schreiben-2",
    number: 2,
    title: "E-Mail",
    maxRaw: 10,
    suggestedMinutes: 18,
    instruction: "Schreiben Sie eine E-Mail, 30 bis 40 Wörter. Gehen Sie auf alle drei Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      ...write()!,
      id: "ga2-schreiben-2",
      register: "halbformell",
      targetWords: 35,
      minWords: 30,
      maxWords: 50,
      situation: "Sie möchten im Bürgerhaus einen Raum für eine Feier mieten. Schreiben Sie an Frau Holm.",
      bullets: ["Sagen Sie, für welchen Tag Sie den Raum brauchen.", "Schreiben Sie, wie viele Personen kommen.", "Fragen Sie nach dem Preis."],
      signals: [
        ["samstag", "sonntag", "mai", "juni", "uhr"],
        ["person", "gäste", "gaeste", "leute"],
        ["preis", "kosten", "euro"],
      ],
    },
  },
];

export const a2Sprechen: Teil[] = [
  {
    id: "ga2-sprechen-1",
    number: 1,
    title: "Fragen zur Person",
    maxRaw: 8,
    instruction: "Fragen Sie nach Geburtstag, Wohnort, Beruf und Hobby. Antworten Sie auch auf die Fragen der Partnerin.",
    stimuli: [],
    items: [],
    speaking: {
      id: "ga2-sprechen-1",
      minutes: 4,
      situation: "Sie lernen eine Partnerin kennen und stellen Fragen.",
      prompts: ["Geburtstag?", "Wohnort?", "Beruf?", "Hobby?"],
      checklist: ["Fragen gestellt", "selbst geantwortet"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 5 },
        { id: "interaktion", label: "Interaktion", max: 3 },
      ],
      examinerAudio: narrate("ga2-s-t1", ["Teil 1. Stellen Sie Fragen zur Person und antworten Sie."]),
    },
  },
  {
    id: "ga2-sprechen-2",
    number: 2,
    title: "Von sich erzählen",
    maxRaw: 9,
    instruction: "Erzählen Sie: Was machen Sie gern in Ihrer Freizeit? Die Karte hat vier Stichpunkte.",
    stimuli: [{ kind: "text", id: "ga2-map", title: "Karte", body: "Freizeit: Sport, Musik, Freunde, Wochenende.", genre: "sign" }],
    items: [],
    speaking: {
      id: "ga2-sprechen-2",
      minutes: 4,
      situation: "Sie erzählen von Ihrer Freizeit. Die Prüferin stellt eine Nachfrage.",
      prompts: ["Sport oder Bewegung", "Musik oder Filme", "Freunde", "ein typisches Wochenende"],
      checklist: ["Freizeit beschrieben", "ein Beispiel genannt"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 6 },
        { id: "interaktion", label: "Nachfrage", max: 3 },
      ],
      examinerAudio: narrate("ga2-s-t2", ["Teil 2. Erzählen Sie von Ihrer Freizeit. Ich stelle danach eine Frage."]),
    },
  },
  {
    id: "ga2-sprechen-3",
    number: 3,
    title: "Gemeinsam planen",
    maxRaw: 8,
    instruction: "Sie haben am Samstag beide wenig Zeit. Finden Sie zusammen einen Termin.",
    stimuli: [
      { kind: "text", id: "ga2-cal-a", title: "Ihr Samstag", body: "10–12 Uhr frei. 14–16 Uhr Arbeit. Ab 18 Uhr frei.", genre: "sign" },
      { kind: "text", id: "ga2-cal-b", title: "Samstag der Partnerin", body: "Vormittag Sport. 15–17 Uhr frei. Abends Familienessen.", genre: "sign" },
    ],
    items: [],
    speaking: {
      id: "ga2-sprechen-3",
      minutes: 5,
      situation: "Finden Sie eine gemeinsame Zeit am Samstag. 15 bis 16 Uhr passt für beide.",
      prompts: ["Fragen Sie nach freien Zeiten.", "Nennen Sie Ihre Zeiten.", "Machen Sie einen Vorschlag."],
      checklist: ["eigene Zeit genannt", "Vorschlag gemacht", "auf die Partnerin reagiert"],
      rubric: [
        { id: "erfuellung", label: "Aufgabenerfüllung", max: 5 },
        { id: "interaktion", label: "Interaktion", max: 3 },
      ],
      examinerAudio: narrate("ga2-s-t3", ["Teil 3. Finden Sie gemeinsam eine Zeit am Samstag."]),
    },
  },
];
