import type { Teil } from "@/lib/exam-model";
import { fill } from "@/content/exams/factory";

export const a1Schreiben: Teil[] = [
  {
    id: "ga1-schreiben-1",
    number: 1,
    title: "Formular",
    maxRaw: 5,
    suggestedMinutes: 8,
    instruction: "Ihre Freundin möchte einen Schwimmkurs. Füllen Sie das Formular aus. Aufgaben 1 bis 5.",
    stimuli: [
      {
        kind: "text",
        id: "ga1-s-text",
        title: "Nora erzählt",
        body: "Ich heiße Nora Klein. Ich bin 28 Jahre alt und komme aus Österreich. Ich spreche Deutsch und Englisch. Mein Hobby ist Schwimmen.",
        genre: "email",
      },
    ],
    items: [
      fill("ga1-w-1", 1, "Name", ["Nora Klein"], "Sie heißt Nora Klein."),
      fill("ga1-w-2", 2, "Alter", ["28"], "Sie ist 28 Jahre alt."),
      fill("ga1-w-3", 3, "Land", ["Österreich", "Oesterreich"], "Sie kommt aus Österreich."),
      fill("ga1-w-4", 4, "Sprachen", ["Deutsch und Englisch", "Deutsch, Englisch"], "Sie spricht Deutsch und Englisch."),
      fill("ga1-w-5", 5, "Hobby", ["Schwimmen"], "Ihr Hobby ist Schwimmen."),
    ],
  },
  {
    id: "ga1-schreiben-2",
    number: 2,
    title: "Kurze Nachricht",
    maxRaw: 10,
    suggestedMinutes: 12,
    instruction: "Schreiben Sie eine kurze Nachricht, etwa 30 Wörter. Gehen Sie auf alle drei Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      id: "ga1-schreiben-2",
      register: "informell",
      targetWords: 30,
      minWords: 20,
      maxWords: 45,
      situation: "Sie laden Ihren Freund Tim zu einer kleinen Feier ein. Schreiben Sie eine Nachricht.",
      bullets: ["Wann ist die Feier?", "Wo ist die Feier?", "Was soll Tim mitbringen?"],
      signals: [
        ["samstag", "sonntag", "uhr", "abend"],
        ["bei mir", "park", "café", "cafe", "straße", "strasse", "wohnung"],
        ["mitbring", "salat", "kuchen", "getränk", "getraenk"],
      ],
      rubric: [
        { id: "erfuellung", label: "Inhaltspunkte", max: 9 },
        { id: "textsorte", label: "Textsorte", max: 1 },
      ],
    },
  },
];
