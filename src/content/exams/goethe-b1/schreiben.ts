import type { Teil } from "@/lib/exam-model";

const rubric40 = [
  { id: "erfuellung", label: "Aufgabenerfüllung", max: 10 },
  { id: "kohaerenz", label: "Kohärenz", max: 10 },
  { id: "wortschatz", label: "Wortschatz", max: 10 },
  { id: "strukturen", label: "Strukturen", max: 10 },
];

const rubric20 = [
  { id: "erfuellung", label: "Aufgabenerfüllung", max: 5 },
  { id: "kohaerenz", label: "Kohärenz", max: 5 },
  { id: "wortschatz", label: "Wortschatz", max: 5 },
  { id: "strukturen", label: "Strukturen", max: 5 },
];

export const schreibenTeile: Teil[] = [
  {
    id: "gb1-schreiben-1",
    number: 1,
    title: "E-Mail an eine Freundin",
    suggestedMinutes: 20,
    maxRaw: 40,
    instruction: "Schreiben Sie eine informelle E-Mail, etwa 80 Wörter. Gehen Sie auf alle drei Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      id: "gb1-schreiben-1",
      register: "informell",
      targetWords: 80,
      minWords: 60,
      maxWords: 110,
      rubric: rubric40,
      situation:
        "Ihre Freundin Mira ist in eine neue Wohnung gezogen und lädt Sie für Samstag zum Essen ein. Schreiben Sie eine E-Mail an Mira.",
      bullets: [
        "Beschreiben Sie, was Sie mitbringen möchten.",
        "Begründen Sie, warum Sie erst später kommen können.",
        "Machen Sie einen Vorschlag für den Abend.",
      ],
      signals: [
        ["mitbring", "kuchen", "salat", "blumen", "wein", "geschenk", "nachtisch", "brot"],
        ["später", "spaeter", "verspät", "verspaet", "erst um", "zug", "überstund", "ueberstund", "arbeit", "schicht"],
        ["vorschlag", "spiel", "spazieren", "film", "musik", "kochen", "fotos", "balkon"],
      ],
    },
  },
  {
    id: "gb1-schreiben-2",
    number: 2,
    title: "Meinung im Gästebuch",
    suggestedMinutes: 25,
    maxRaw: 40,
    instruction: "Schreiben Sie Ihre Meinung ins Gästebuch, etwa 80 Wörter. Gehen Sie auf alle Punkte ein und reagieren Sie auf das Zitat.",
    stimuli: [],
    items: [],
    writing: {
      id: "gb1-schreiben-2",
      register: "halbformell, Forumsbeitrag",
      targetWords: 80,
      minWords: 60,
      maxWords: 120,
      rubric: rubric40,
      quote: "„Eine Stunde ist viel zu wenig. Jugendliche brauchen die Netzwerke für die Schule und für Freunde.“ — Samir, 17",
      situation:
        "Im Fernsehen gab es eine Diskussion: Sollten Jugendliche unter 16 Jahren in sozialen Netzwerken nur eine Stunde am Tag sein dürfen? Schreiben Sie Ihre Meinung ins Gästebuch der Sendung.",
      bullets: [
        "Schreiben Sie Ihre Meinung zum Vorschlag.",
        "Nennen Sie Gründe.",
        "Geben Sie ein Beispiel.",
        "Reagieren Sie auf Samirs Meinung.",
      ],
      signals: [
        ["meinung", "finde", "dafür", "dafuer", "dagegen", "stimme", "sollte", "nicht"],
        ["weil", "denn", "deshalb", "grund", "wichtig"],
        ["zum beispiel", "beispiel", "freund", "schule", "klasse", "bruder", "schwester", "ich selbst", "bei uns"],
        ["samir", "eine stunde", "zu wenig", "freunde", "schule"],
      ],
    },
  },
  {
    id: "gb1-schreiben-3",
    number: 3,
    title: "E-Mail an die Kursleitung",
    suggestedMinutes: 15,
    maxRaw: 20,
    instruction: "Schreiben Sie eine halbformelle E-Mail, etwa 40 Wörter. Gehen Sie auf alle drei Punkte ein.",
    stimuli: [],
    items: [],
    writing: {
      id: "gb1-schreiben-3",
      register: "halbformell",
      targetWords: 40,
      minWords: 30,
      maxWords: 70,
      rubric: rubric20,
      situation:
        "Sie haben ein Zimmer für einen Wochenendkurs an der Sprachschule Bergblick gebucht. Sie sind krank und können nicht kommen. Schreiben Sie an Frau Lembke im Kursbüro.",
      bullets: ["Entschuldigen Sie sich.", "Erklären Sie kurz den Grund.", "Fragen Sie, ob Sie auf den nächsten Termin wechseln können."],
      signals: [
        ["entschuld", "tut mir leid", "leider"],
        ["krank", "fieber", "arzt", "nicht kommen", "ausfallen"],
        ["nächst", "naechst", "verschieben", "wechseln", "termin", "nachholen"],
      ],
    },
  },
];
