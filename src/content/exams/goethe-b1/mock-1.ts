import type { MockExam } from "@/lib/exam-model";
import { validateGoetheB1 } from "@/content/exams/validate";
import { hoerenIntro, hoerenTeile } from "@/content/exams/goethe-b1/hoeren";
import { lesenTeile } from "@/content/exams/goethe-b1/lesen";
import { schreibenTeile } from "@/content/exams/goethe-b1/schreiben";
import { sprechenTeile } from "@/content/exams/goethe-b1/sprechen";

export const goetheB1Mock: MockExam = {
  id: "goethe-b1-mock-1",
  trackId: "goethe-b1",
  provider: "goethe",
  level: "B1",
  title: "Goethe-Zertifikat B1 · Modellsatz 1",
  isFree: true,
  label: "Beispieldaten",
  scoring: {
    kind: "goethe-modular",
    perModuleMax: 100,
    pass: 60,
    convert: { lesen: "x100/30", hoeren: "x100/30" },
  },
  breaks: [
    { afterModuleId: "lesen", minutes: 15, kind: "pause" },
    { afterModuleId: "hoeren", minutes: 15, kind: "pause" },
  ],
  modules: [
    {
      id: "lesen",
      skill: "lesen",
      title: "Lesen",
      minutes: 65,
      intro: {
        text: "Das Modul Lesen hat fünf Teile und dauert 65 Minuten. Sie können zwischen den Teilen wechseln. Ein Wörterbuch ist nicht erlaubt.",
      },
      teile: lesenTeile,
    },
    {
      id: "hoeren",
      skill: "hoeren",
      title: "Hören",
      minutes: 40,
      transferMinutes: 5,
      intro: {
        text: "Das Modul Hören hat vier Teile. Die Texte starten von selbst. In der Prüfung können Sie nicht pausieren und nicht zurückspulen. Am Ende haben Sie fünf Minuten für den Antwortbogen.",
        audio: hoerenIntro,
      },
      teile: hoerenTeile,
    },
    {
      id: "schreiben",
      skill: "schreiben",
      title: "Schreiben",
      minutes: 60,
      intro: {
        text: "Das Modul Schreiben dauert 60 Minuten: etwa 20 Minuten für die E-Mail, 25 Minuten für die Meinung und 15 Minuten für die kurze Nachricht.",
      },
      teile: schreibenTeile,
    },
    {
      id: "sprechen",
      skill: "sprechen",
      title: "Sprechen",
      minutes: 15,
      prepMinutes: 15,
      intro: {
        text: "Das Modul Sprechen dauert etwa 15 Minuten, dazu 15 Minuten Vorbereitung. Sie planen, halten einen kurzen Vortrag und reagieren auf Ihre Partnerin.",
      },
      teile: sprechenTeile,
      moduleRubric: [{ id: "aussprache", label: "Aussprache", max: 16 }],
    },
  ],
};

const problems = validateGoetheB1(goetheB1Mock);
if (problems.length > 0) {
  throw new Error(`Goethe-B1-Modellsatz ungültig:\n${problems.join("\n")}`);
}
