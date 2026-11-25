import { JN_OPTIONS, RF_OPTIONS, type Item, type Teil } from "@/lib/exam-model";

function rf(number: number, prompt: string, correct: "richtig" | "falsch", explanation: string, stimulusId?: string): Item {
  return {
    id: `gb1-l-${number}`,
    number,
    type: "rf",
    prompt,
    options: RF_OPTIONS,
    correct,
    points: 1,
    explanation,
    stimulusId,
  };
}

function mc(
  number: number,
  prompt: string,
  options: { id: string; label: string }[],
  correct: string,
  explanation: string,
  stimulusId?: string,
): Item {
  return {
    id: `gb1-l-${number}`,
    number,
    type: "mc3",
    prompt,
    options,
    correct,
    points: 1,
    explanation,
    stimulusId,
  };
}

const blog = `Seit Anfang März wohne ich in Kirchfeld. Vorher habe ich acht Jahre in Hamburg gelebt, direkt am Hafen. Die Wohnung dort war klein und teuer, aber ich konnte zu Fuß zur Arbeit gehen. Jetzt arbeite ich an drei Tagen von zu Hause und fahre nur dienstags und donnerstags ins Büro nach Lübeck.

Hinter der alten Schule gibt es einen Gemeinschaftsgarten. Ich habe im April ein Beet bekommen. Die Mitgliedschaft kostet zwanzig Euro im Jahr. Werkzeug liegt im Schuppen und gehört allen. Im Juni waren die Erdbeeren reif, und wir haben zusammen Marmelade gekocht.

Der Hafen fehlt mir noch oft, vor allem abends. Dafür schlafe ich besser, weil nachts keine Lastwagen vorbeifahren. Am kommenden Wochenende kommt mein Bruder Paul. Er mag keine Gartenarbeit. Wir gehen deshalb an den See und leihen uns dort ein Boot, statt Unkraut zu ziehen.`;

const bibliothek = `Die Stadtbibliothek Nordhafen verleiht seit diesem Monat nicht nur Bücher, sondern auch Werkzeug. Wer eine Bohrmaschine braucht, kommt mit dem Bibliotheksausweis. Einen extra Pfand gibt es nicht. Werkzeug bleibt sieben Tage zu Hause, Bücher wie bisher drei Wochen. Am beliebtesten sind die Bohrmaschinen, danach die Leiter.

Wer noch Gebühren offen hat, bekommt nichts ausgeliehen, auch kein Buch. Am Samstag zeigt eine Bibliothekarin, wie man ein Regal an die Wand bringt. Der Kurs ist kostenlos, aber nur für Menschen mit Ausweis. Treffpunkt ist um elf Uhr im Keller, nicht im Lesesaal.`;

const woche = `Die Firma Keller und Sohn hat ein Jahr lang eine Vier-Tage-Woche ausprobiert. Die Beschäftigten arbeiten an vier Tagen je neun Stunden, also 36 statt früher 40 Stunden. Der Lohn ist gleich geblieben. Nach zwölf Monaten gab es weniger Krankmeldungen. Zwei Gruppen in der Werkstatt sagen aber, die langen Tage seien anstrengend.

Die Firma behält das Modell. Die Werkstatt darf aber selbst wählen und weiter an fünf kürzeren Tagen arbeiten. Das Büro bleibt bei vier Tagen. Neue Stellen werden weiter mit dem gleichen Lohn ausgeschrieben.`;

const ads: { id: string; title: string; body: string }[] = [
  { id: "a", title: "a · Fahrradwerkstatt Speiche", body: "Reparatur ohne Termin. Mittwoch bis Freitag, 14 bis 18 Uhr. Kirchfeld, Mühlenweg 4." },
  { id: "b", title: "b · Sprachcafé", body: "Deutsch üben, alle Niveaus. Dienstags 18.30 Uhr im Gemeindehaus. Kostenlos, ohne Anmeldung." },
  { id: "c", title: "c · Hundeschule Pfote", body: "Wochenendkurs für junge Hunde. Anmeldung nur per E-Mail. Nächster Start im April." },
  { id: "d", title: "d · Wohnungstausch", body: "Zwei Zimmer in Kirchfeld gegen drei Zimmer in der Innenstadt, ab Mai. Nur langfristig." },
  { id: "e", title: "e · Mathe-Nachhilfe", body: "Studentin hilft in Klasse 8 bis 10. Fünfzehn Euro pro Stunde, auch online." },
  { id: "f", title: "f · Kochkurs Suppen", body: "Vier Abende, höchstens acht Personen. Achtzig Euro, Start am 3. März im Bürgerhaus." },
  { id: "g", title: "g · Kinderkleidung", body: "Flohmarkt am Sonntag, 11 bis 15 Uhr. Ein Tisch für Verkäufer kostet fünf Euro." },
  { id: "h", title: "h · Mitfahrgelegenheit", body: "Kirchfeld–Hamburg, jeden Freitag 16 Uhr. Drei Plätze, Kostenanteil zwanzig Euro." },
  { id: "i", title: "i · Yoga im Park", body: "Mai bis September, sonntags 9 Uhr. Eigene Matte mitbringen. Spende erwünscht." },
  { id: "j", title: "j · Computerkurs", body: "Für Seniorinnen und Senioren, montags 10 Uhr in der Bibliothek. Bitte anmelden, sechs Plätze." },
];

const proposal = `Die Stadt Kirchfeld möchte die Marktstraße samstags von 10 bis 18 Uhr für Autos sperren. Auf der Straße soll ein Wochenmarkt stehen, und vor den Cafés sollen Sitzplätze möglich sein.`;

const rules = `Hausordnung Wohnheim Ulmenweg

Ruhe ist von 22 Uhr bis 7 Uhr. In dieser Zeit bleiben Flur und Küche leise.
Gäste dürfen bis 21 Uhr bleiben. Wer über Nacht bleibt, muss einen Tag vorher im Büro gemeldet werden.
Die Küche wird am selben Abend geputzt, an dem Sie kochen.
Fahrräder stehen nur im Fahrradraum, nicht im Flur.
Waschmaschinen: Tragen Sie sich in die Liste ein. Eine Wäsche dauert höchstens zwei Stunden.
Rauchen ist nur im Hof erlaubt.
Ein verlorener Schlüssel kostet 30 Euro. Das Büro gibt neue Schlüssel von Montag bis Freitag aus.`;

export const lesenTeile: Teil[] = [
  {
    id: "gb1-lesen-1",
    number: 1,
    title: "Blog",
    suggestedMinutes: 10,
    maxRaw: 6,
    instruction: "Lesen Sie den Blog und die Aufgaben 1 bis 6. Ist die Aussage richtig oder falsch? Das Beispiel ist schon gelöst.",
    stimuli: [{ kind: "text", id: "gb1-l1-blog", title: "Drei Monate in Kirchfeld", body: blog, genre: "blog" }],
    example: rf(
      0,
      "Die Autorin wohnt schon seit vielen Jahren in Kirchfeld.",
      "falsch",
      "Sie ist erst seit Anfang März in Kirchfeld. Vorher hat sie acht Jahre in Hamburg gelebt.",
      "gb1-l1-blog",
    ),
    items: [
      rf(1, "Die Autorin arbeitet die ganze Woche im Büro in Lübeck.", "falsch", "Sie fährt nur dienstags und donnerstags ins Büro. An drei Tagen arbeitet sie zu Hause.", "gb1-l1-blog"),
      rf(2, "Der Gemeinschaftsgarten liegt hinter der alten Schule.", "richtig", "Das steht im zweiten Absatz.", "gb1-l1-blog"),
      rf(3, "Jede Person muss ihr eigenes Werkzeug mitbringen.", "falsch", "Das Werkzeug liegt im Schuppen und gehört allen.", "gb1-l1-blog"),
      rf(4, "Im Juni haben die Mitglieder Erdbeeren geerntet.", "richtig", "Im Juni waren die Erdbeeren reif, und sie haben Marmelade gekocht.", "gb1-l1-blog"),
      rf(5, "Die Autorin vermisst den Hafen nicht mehr.", "falsch", "Der Hafen fehlt ihr noch oft, vor allem abends.", "gb1-l1-blog"),
      rf(6, "Am nächsten Wochenende arbeitet sie mit ihrem Bruder im Garten.", "falsch", "Paul mag keine Gartenarbeit. Sie gehen an den See und leihen ein Boot.", "gb1-l1-blog"),
    ],
  },
  {
    id: "gb1-lesen-2",
    number: 2,
    title: "Presse",
    suggestedMinutes: 20,
    maxRaw: 6,
    instruction: "Lesen Sie die beiden Texte und wählen Sie bei den Aufgaben 7 bis 12 die richtige Lösung a, b oder c.",
    stimuli: [
      { kind: "text", id: "gb1-l2-a", title: "Bücher und Bohrmaschinen", body: bibliothek, genre: "article" },
      { kind: "text", id: "gb1-l2-b", title: "Vier Tage, längere Tage", body: woche, genre: "article" },
    ],
    items: [
      mc(7, "Was braucht man, um eine Bohrmaschine auszuleihen?", [
        { id: "a", label: "nur einen Personalausweis" },
        { id: "b", label: "einen Bibliotheksausweis" },
        { id: "c", label: "fünfzig Euro Pfand" },
      ], "b", "Man kommt mit dem Bibliotheksausweis. Einen extra Pfand gibt es nicht.", "gb1-l2-a"),
      mc(8, "Wie lange darf das Werkzeug zu Hause bleiben?", [
        { id: "a", label: "sieben Tage" },
        { id: "b", label: "drei Wochen" },
        { id: "c", label: "einen Monat" },
      ], "a", "Werkzeug bleibt sieben Tage, Bücher drei Wochen.", "gb1-l2-a"),
      mc(9, "Der Kurs am Samstag …", [
        { id: "a", label: "kostet extra und findet im Lesesaal statt." },
        { id: "b", label: "ist abgesagt." },
        { id: "c", label: "ist kostenlos für Menschen mit Ausweis." },
      ], "c", "Der Kurs ist kostenlos, aber nur mit Ausweis. Treffpunkt ist der Keller.", "gb1-l2-a"),
      mc(10, "Was gilt für den Lohn in der Vier-Tage-Woche?", [
        { id: "a", label: "Er ist niedriger als früher." },
        { id: "b", label: "Er ist gleich geblieben." },
        { id: "c", label: "Er ist höher, weil die Tage länger sind." },
      ], "b", "Der Lohn ist gleich geblieben.", "gb1-l2-b"),
      mc(11, "Was ist nach dem Jahr passiert?", [
        { id: "a", label: "Es gab mehr Krankmeldungen." },
        { id: "b", label: "Die Krankmeldungen sind gleich geblieben." },
        { id: "c", label: "Es gab weniger Krankmeldungen." },
      ], "c", "Nach zwölf Monaten gab es weniger Krankmeldungen.", "gb1-l2-b"),
      mc(12, "Was darf die Werkstatt jetzt?", [
        { id: "a", label: "Sie muss bei vier Tagen bleiben." },
        { id: "b", label: "Sie darf fünf kürzere Tage wählen." },
        { id: "c", label: "Das Modell ist für alle beendet." },
      ], "b", "Die Werkstatt darf weiter an fünf kürzeren Tagen arbeiten. Das Büro bleibt bei vier Tagen.", "gb1-l2-b"),
    ],
  },
  {
    id: "gb1-lesen-3",
    number: 3,
    title: "Anzeigen",
    suggestedMinutes: 10,
    maxRaw: 7,
    allowNone: true,
    noneLabel: "0 – keine passende Anzeige",
    instruction:
      "Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt? Jede Anzeige nur einmal. Manchmal passt keine. Das Beispiel ist schon gelöst und belegt Anzeige a.",
    options: ads.map((ad) => ({ id: ad.id, label: ad.title })),
    stimuli: ads.map((ad) => ({ kind: "text" as const, id: `gb1-ad-${ad.id}`, title: ad.title, body: ad.body, genre: "ad" as const })),
    example: {
      id: "gb1-l-bsp-3",
      number: 0,
      type: "match",
      prompt: "Sie wollen Ihr Fahrrad reparieren lassen und haben keinen Termin.",
      correct: "a",
      points: 0,
      explanation: "Die Werkstatt Speiche repariert ohne Termin.",
    },
    items: [
      { id: "gb1-l-13", number: 13, type: "match", prompt: "Sie möchten abends kostenlos Deutsch sprechen.", correct: "b", points: 1, explanation: "Das Sprachcafé ist dienstags abends und kostenlos." },
      { id: "gb1-l-14", number: 14, type: "match", prompt: "Sie haben zwei Zimmer in Kirchfeld und suchen eine größere Wohnung in der Innenstadt.", correct: "d", points: 1, explanation: "Die Anzeige bietet genau diesen Tausch an." },
      { id: "gb1-l-15", number: 15, type: "match", prompt: "Ihr Kind in Klasse 9 braucht Hilfe in Mathematik.", correct: "e", points: 1, explanation: "Die Nachhilfe gilt für Klasse 8 bis 10." },
      { id: "gb1-l-16", number: 16, type: "match", prompt: "Sie wollen am Sonntag Kinderkleidung verkaufen.", correct: "g", points: 1, explanation: "Der Flohmarkt ist sonntags, ein Tisch kostet fünf Euro." },
      { id: "gb1-l-17", number: 17, type: "match", prompt: "Sie wollen freitags nach Hamburg mitfahren und etwa zwanzig Euro zahlen.", correct: "h", points: 1, explanation: "Die Mitfahrgelegenheit fährt freitags, Kostenanteil zwanzig Euro." },
      { id: "gb1-l-18", number: 18, type: "match", prompt: "Sie möchten an mehreren Abenden in einer kleinen Gruppe kochen lernen.", correct: "f", points: 1, explanation: "Der Kochkurs hat vier Abende und höchstens acht Personen." },
      { id: "gb1-l-19", number: 19, type: "match", prompt: "Sie suchen eine Klavierlehrerin für Ihr Kind.", correct: "0", points: 1, explanation: "Keine Anzeige bietet Klavierunterricht an." },
    ],
  },
  {
    id: "gb1-lesen-4",
    number: 4,
    title: "Meinungen",
    suggestedMinutes: 15,
    maxRaw: 7,
    instruction: "Lesen Sie den Vorschlag und die Kommentare 20 bis 26. Ist die Person für den Vorschlag? Wählen Sie Ja oder Nein.",
    stimuli: [
      { kind: "text", id: "gb1-l4-vorschlag", title: "Vorschlag der Stadt", body: proposal, genre: "forum" },
      { kind: "text", id: "gb1-l4-20", title: "20 · Mira", body: "Endlich kann ich mit dem Kinderwagen durch die Straße, ohne vor Autos Angst zu haben. Ich bin dafür.", genre: "comment" },
      { kind: "text", id: "gb1-l4-21", title: "21 · Herr Bode", body: "Ich habe einen Laden in der Marktstraße. Samstags kommen viele Kunden mit dem Auto. Wenn sie nicht parken können, kaufen sie woanders. Ich bin dagegen.", genre: "comment" },
      { kind: "text", id: "gb1-l4-22", title: "22 · Selin", body: "Ein Markt am Samstag klingt nett. Aber nur, wenn die Busse weiter durch die Straße fahren. Davon steht im Plan nichts. Deshalb stimme ich nicht zu.", genre: "comment" },
      { kind: "text", id: "gb1-l4-23", title: "23 · Herr Kruse", body: "Ich wohne über der Straße. Weniger Lärm am Samstag wäre wunderbar. Ja, bitte so machen.", genre: "comment" },
      { kind: "text", id: "gb1-l4-24", title: "24 · Aylin", body: "Die Cafés verdienen dann mehr, und die Straße wird lebendiger. Das finde ich gut.", genre: "comment" },
      { kind: "text", id: "gb1-l4-25", title: "25 · Cem", body: "Ich liefere Essen aus. Wenn die Straße zu ist, brauche ich für jede Tour zwanzig Minuten länger. So kann ich nicht arbeiten.", genre: "comment" },
      { kind: "text", id: "gb1-l4-26", title: "26 · Nora", body: "Meine Mutter sitzt im Rollstuhl. Ohne Autos kommt sie viel leichter zum Markt. Ich unterstütze den Plan.", genre: "comment" },
    ],
    items: [20, 21, 22, 23, 24, 25, 26].map((number) => {
      const yes = [20, 23, 24, 26].includes(number);
      const why: Record<number, string> = {
        20: "Mira sagt klar, dass sie dafür ist.",
        21: "Herr Bode ist dagegen, weil seine Kunden mit dem Auto kommen.",
        22: "Selin stimmt nicht zu, solange die Busse im Plan fehlen.",
        23: "Herr Kruse möchte weniger Lärm und sagt Ja.",
        24: "Aylin findet den lebendigeren Samstag gut.",
        25: "Cem kann mit der Sperrung nicht arbeiten. Er ist dagegen.",
        26: "Nora unterstützt den Plan, weil ihre Mutter den Markt leichter erreicht.",
      };
      return {
        id: `gb1-l-${number}`,
        number,
        type: "jn" as const,
        prompt: "Ist die Person für den Vorschlag?",
        options: JN_OPTIONS,
        correct: yes ? "ja" : "nein",
        points: 1,
        explanation: why[number],
        stimulusId: `gb1-l4-${number}`,
      };
    }),
  },
  {
    id: "gb1-lesen-5",
    number: 5,
    title: "Hausordnung",
    suggestedMinutes: 10,
    maxRaw: 4,
    instruction: "Lesen Sie die Hausordnung und wählen Sie bei den Aufgaben 27 bis 30 die richtige Lösung a, b oder c.",
    stimuli: [{ kind: "text", id: "gb1-l5-rules", title: "Hausordnung Wohnheim Ulmenweg", body: rules, genre: "rules" }],
    items: [
      mc(27, "Eine Freundin möchte über Nacht bleiben. Was ist richtig?", [
        { id: "a", label: "Übernachtungsgäste sind verboten." },
        { id: "b", label: "Sie müssen den Gast einen Tag vorher im Büro melden." },
        { id: "c", label: "Es reicht, die Nachbarin zu informieren." },
      ], "b", "Wer über Nacht bleibt, muss einen Tag vorher im Büro gemeldet werden.", "gb1-l5-rules"),
      mc(28, "Sie kommen um 23 Uhr nach Hause und wollen im Flur telefonieren. Was gilt?", [
        { id: "a", label: "Das ist in Ordnung, die Küche ist dann zu." },
        { id: "b", label: "Die Ruhezeit hat begonnen, der Flur soll leise bleiben." },
        { id: "c", label: "Die Ruhezeit beginnt erst um Mitternacht." },
      ], "b", "Ruhe ist von 22 Uhr bis 7 Uhr. Flur und Küche bleiben leise.", "gb1-l5-rules"),
      mc(29, "Wo steht Ihr Fahrrad?", [
        { id: "a", label: "Bei Regen darf es im Flur stehen." },
        { id: "b", label: "Nur im Fahrradraum." },
        { id: "c", label: "Es muss mit ins Zimmer." },
      ], "b", "Fahrräder stehen nur im Fahrradraum, nicht im Flur.", "gb1-l5-rules"),
      mc(30, "Sie verlieren den Schlüssel. Was stimmt?", [
        { id: "a", label: "Ein neuer Schlüssel kostet 30 Euro." },
        { id: "b", label: "Der erste neue Schlüssel ist kostenlos." },
        { id: "c", label: "Das Büro gibt keine Schlüssel aus." },
      ], "a", "Ein verlorener Schlüssel kostet 30 Euro. Das Büro gibt sie werktags aus.", "gb1-l5-rules"),
    ],
  },
];
