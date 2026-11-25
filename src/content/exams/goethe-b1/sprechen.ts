import { REPEAT_CUE, type AudioScript, type Teil } from "@/lib/exam-model";
import { NARRATOR, PARTNERIN } from "@/content/exams/goethe-b1/speakers";

function duo(id: string, lines: { speaker: "narrator" | "partnerin"; text: string }[]): AudioScript {
  return {
    id,
    plays: 1,
    readSeconds: 0,
    betweenPlaysSeconds: 0,
    answerSeconds: 0,
    repeatCue: REPEAT_CUE,
    speakers: [NARRATOR, PARTNERIN],
    lines: lines.map((line) => ({
      speaker: line.speaker === "narrator" ? NARRATOR.id : PARTNERIN.id,
      text: line.text,
    })),
  };
}

const rubric1 = [
  { id: "erfuellung", label: "Aufgabenerfüllung", max: 8 },
  { id: "interaktion", label: "Interaktion", max: 4 },
  { id: "wortschatz", label: "Wortschatz", max: 8 },
  { id: "strukturen", label: "Strukturen", max: 8 },
];

const rubric2 = [
  { id: "erfuellung", label: "Aufgabenerfüllung", max: 12 },
  { id: "interaktion", label: "Interaktion", max: 4 },
  { id: "wortschatz", label: "Wortschatz", max: 12 },
  { id: "strukturen", label: "Strukturen", max: 12 },
];

const rubric3 = [
  { id: "erfuellung", label: "Aufgabenerfüllung", max: 4 },
  { id: "interaktion", label: "Interaktion", max: 4 },
  { id: "wortschatz", label: "Wortschatz", max: 4 },
  { id: "strukturen", label: "Strukturen", max: 4 },
];

const slides = [
  "Folie 1: das Thema nennen",
  "Folie 2: die eigene Erfahrung",
  "Folie 3: die Situation im Heimatland oder in Ihrer Stadt",
  "Folie 4: Vorteile, Nachteile und Ihre Meinung",
  "Folie 5: ein kurzer Schluss",
];

export const sprechenTeile: Teil[] = [
  {
    id: "gb1-sprechen-1",
    number: 1,
    title: "Gemeinsam planen",
    suggestedMinutes: 3,
    maxRaw: 28,
    instruction: "Planen Sie mit Ihrer Partnerin etwa drei Minuten lang eine Feier. Gehen Sie auf alle vier Punkte ein und reagieren Sie auf Nora.",
    stimuli: [],
    items: [],
    speaking: {
      id: "gb1-sprechen-1",
      minutes: 3,
      rubric: rubric1,
      situation: "Ihre Kollegin Sara zieht nach Dresden. Sie und Nora wollen eine Abschiedsfeier für sie organisieren.",
      prompts: ["Wann und wo?", "Wen laden Sie ein?", "Was gibt es zu essen und zu trinken?", "Welches kleine Programm passt?"],
      partnerLines: [{ name: "Nora", text: "Sara zieht nächsten Monat nach Dresden. Wir sollten eine Abschiedsfeier machen. Wann hättest du Zeit?" }],
      cues: [
        { role: "examiner", name: "Frau Berger", text: "Guten Tag. Ich bin Frau Berger und leite die mündliche Prüfung. Wir beginnen." },
        { role: "examiner", name: "Frau Berger", text: "Teil 1. Sie planen mit Ihrer Partnerin eine Abschiedsfeier. Gehen Sie auf alle Punkte ein. Sie haben etwa drei Minuten. Bitte beginnen Sie." },
        { role: "partner", name: "Nora", text: "Sara zieht nächsten Monat nach Dresden. Wir sollten eine Abschiedsfeier machen. Wann hättest du Zeit, und wo könnten wir uns treffen?", reply: true },
        { role: "partner", name: "Nora", text: "Einverstanden. Wen laden wir ein?", reply: true },
        { role: "partner", name: "Nora", text: "Gut. Was gibt es zu essen und zu trinken?", reply: true },
        { role: "partner", name: "Nora", text: "Das passt. Und welches kleine Programm schlägst du vor?", reply: true },
        { role: "examiner", name: "Frau Berger", text: "Vielen Dank. Das war Teil 1." },
      ],
      checklist: ["Zeit oder Ort genannt", "Gäste genannt", "Essen oder Trinken genannt", "auf Nora reagiert"],
      examinerAudio: duo("gb1-s-t1", [
        { speaker: "narrator", text: "Teil 1. Sie planen gemeinsam eine Feier. Sie haben etwa drei Minuten." },
        { speaker: "partnerin", text: "Sara zieht nächsten Monat nach Dresden. Wir sollten eine Abschiedsfeier machen. Wann hättest du Zeit?" },
      ]),
    },
  },
  {
    id: "gb1-sprechen-2",
    number: 2,
    title: "Präsentation",
    suggestedMinutes: 3,
    maxRaw: 40,
    instruction: "Wählen Sie eines der beiden Themen und sprechen Sie etwa drei Minuten. Die fünf Folien geben die Reihenfolge vor.",
    stimuli: [],
    items: [],
    speaking: {
      id: "gb1-sprechen-2",
      minutes: 3,
      rubric: rubric2,
      situation: "Sie halten einen kurzen Vortrag. Wählen Sie Thema A oder Thema B.",
      prompts: slides,
      topics: [
        { id: "homeoffice", title: "Thema A: Homeoffice", prompts: slides },
        { id: "verkehr", title: "Thema B: Öffentliche Verkehrsmittel in meiner Stadt", prompts: slides },
      ],
      cues: [
        { role: "examiner", name: "Frau Berger", text: "Teil 2. Wählen Sie ein Thema und halten Sie einen Vortrag von etwa drei Minuten. Die Folien geben die Reihenfolge vor. Bitte beginnen Sie.", reply: true },
        { role: "examiner", name: "Frau Berger", text: "Danke. Was ist für Sie der größte Vorteil?", reply: true },
        { role: "examiner", name: "Frau Berger", text: "Vielen Dank. Das war Teil 2." },
      ],
      checklist: ["Thema genannt", "eigene Erfahrung", "Situation vor Ort", "Vorteile oder Nachteile und Meinung", "Schluss"],
      examinerAudio: duo("gb1-s-t2", [
        { speaker: "narrator", text: "Teil 2. Wählen Sie ein Thema und halten Sie einen kurzen Vortrag. Sie haben etwa drei Minuten." },
        { speaker: "narrator", text: "Sprechen Sie zum Thema, zu Ihrer Erfahrung, zur Situation bei Ihnen, zu Vorteilen und Nachteilen, und schließen Sie kurz." },
      ]),
    },
  },
  {
    id: "gb1-sprechen-3",
    number: 3,
    title: "Nachfragen",
    suggestedMinutes: 2,
    maxRaw: 16,
    instruction: "Reagieren Sie auf den Vortrag Ihrer Partnerin, stellen Sie eine Frage und beantworten Sie ihre Frage. Etwa zwei Minuten.",
    stimuli: [],
    items: [],
    speaking: {
      id: "gb1-sprechen-3",
      minutes: 2,
      rubric: rubric3,
      situation: "Nora hat einen Vortrag gehalten. Geben Sie eine kurze Rückmeldung, stellen Sie eine Frage und antworten Sie auf ihre Frage.",
      prompts: ["Sagen Sie, was Sie am Vortrag interessant fanden.", "Stellen Sie eine Frage.", "Antworten Sie auf Noras Frage."],
      cues: [
        { role: "examiner", name: "Frau Berger", text: "Teil 3. Geben Sie eine kurze Rückmeldung, stellen Sie eine Frage und antworten Sie auf Nora. Bitte beginnen Sie." },
        { role: "partner", name: "Nora", text: "Ich habe meinen Vortrag beendet. Was fandest du daran interessant?", reply: true },
        { role: "partner", name: "Nora", text: "Danke. Und was würdest du mich fragen?", reply: true },
        { role: "examiner", name: "Frau Berger", text: "Vielen Dank. Das war Teil 3." },
      ],
      checklist: ["Rückmeldung gegeben", "eine Frage gestellt", "Noras Frage beantwortet"],
      examinerAudio: duo("gb1-s-t3", [
        { speaker: "narrator", text: "Teil 3. Geben Sie eine kurze Rückmeldung und stellen Sie eine Frage. Danach antworten Sie." },
      ]),
      followupAudio: {
        homeoffice: duo("gb1-s-t3-home", [
          { speaker: "partnerin", text: "Du hast über Homeoffice gesprochen. Arbeitest du lieber zu Hause oder im Büro, und warum?" },
        ]),
        verkehr: duo("gb1-s-t3-verkehr", [
          { speaker: "partnerin", text: "Du hast über Bus und Bahn gesprochen. Was sollte deine Stadt als Erstes ändern?" },
        ]),
        default: duo("gb1-s-t3-default", [
          { speaker: "partnerin", text: "Was war für dich der wichtigste Punkt in deinem Vortrag?" },
        ]),
      },
    },
  },
];
