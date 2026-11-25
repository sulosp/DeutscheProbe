# DeutscheProbe

Kostenlose Web-App zum Üben der Goethe- und telc-Prüfungen Deutsch A1 bis B2. Lesen, Hören, Schreiben, Sprechen und, bei telc B1 und B2, Sprachbausteine.

Goethe-Zertifikat B1 hat einen vollständigen Modellsatz: vier Module in der Prüfungsreihenfolge, alle Teile mit Aufgabenzahl, Zeit und, beim Hören, Anzahl der Wiedergaben. Die anderen Strecken behalten vorerst die kürzeren Aufgaben. Alle Texte sind eigene Beispieldaten. DeutscheProbe ist nicht mit dem Goethe-Institut oder telc verbunden und verwendet keine Prüfungslogos und keine offiziellen Aufgaben.

## Demo-Modus

Ohne Umgebungsvariablen läuft die App lokal im Browser:

- Konto, Ziel und Versuche liegen in `localStorage`
- eine laufende Probeprüfung liegt in `sessionStorage`
- Schreiben und Sprechen bekommen eine eingebaute Einschätzung
- Hören im Goethe-B1-Modellsatz spielt vorbereitete Aufnahmen ab. Die kürzeren Aufgaben der anderen Strecken nutzen die Sprachausgabe des Browsers
- Sprechen nimmt über das Mikrofon auf (`MediaRecorder`). Die Aufnahme bleibt im Tab

`Beispiel ansehen` öffnet ein Beispielkonto auf Goethe B1. Die Zahlen auf der Übersicht sind dann als Beispieldaten gekennzeichnet, bis eigene Versuche dazukommen.

## Einrichten

```bash
npm install
cp .env.example .env.local
npm run dev
```

Die App liegt auf [http://localhost:3000](http://localhost:3000).

## Umgebung

Siehe `.env.example`. Nichts davon ist Pflicht.

| Variable | Zweck |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase-Projekt, Free Tier |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `GEMINI_API_KEY` | Einschätzung für Schreiben und Sprechen, Free Tier |
| `GEMINI_MODEL` | Standard `gemini-2.0-flash` |

Supabase: E-Mail und Google unter Authentication aktivieren, `.../auth/callback` als Redirect eintragen, dann `supabase/schema.sql` im SQL-Editor ausführen. Profile und Versuche sind mit Row Level Security auf die eigene Nutzerin beschränkt.

Ohne `GEMINI_API_KEY` antwortet `/api/feedback` mit der Demo-Einschätzung.

## Strecken

Acht Übersichten: Goethe und telc, jeweils A1, A2, B1, B2. Prüfung und Niveau lassen sich auf der Übersicht wechseln.

Der Goethe-B1-Modellsatz liegt unter `src/content/exams/goethe-b1`. Lesen 65 Minuten (Teile 1–5, Aufgaben 1–30), Hören etwa 40 Minuten plus fünf Minuten Antwortbogen (Teile 1–4, Aufgaben 1–30, Texte ein- oder zweimal), Schreiben 60 Minuten (drei Aufgaben), Sprechen etwa 15 Minuten plus 15 Minuten Vorbereitung. Jedes Modul gilt ab 60 von 100 Punkten als bestanden. Lesen und Hören rechnen 30 Rohpunkte auf 100 um. Im Prüfungsmodus läuft Hören ohne Pause und ohne Zurückspulen. Einzelne Teile lassen sich unter Üben mit sofortiger Lösung wiederholen.

Die Hördateien liegen in `public/audio/goethe-b1` und `public/audio/cues`. Neu erzeugen, nachdem `edge-tts` und ffmpeg installiert sind:

```bash
pip install -r scripts/tts/requirements.txt
npm run audio
```

Die übrigen Probeprüfungen folgen der üblichen Reihenfolge und den veröffentlichten Dauern (Orientierung, keine amtliche Durchführung):

- Goethe A1: Hören, Lesen, Schreiben, Sprechen
- Goethe A2, B1, B2: Lesen, Hören, Schreiben, Sprechen
- telc A1 und A2: Hören, dann der Block Lesen und Schreiben, dann Sprechen
- telc B1 und B2: Lesen, Sprachbausteine, Hören, Schreiben, Sprechen

Zwischen den schriftlichen Goethe-Modulen B1 und B2 ist in der Prüfung eine Pause vorgesehen. In der App kann man sofort weitergehen. Während der Prüfung gibt es keine Auswertung.

Neue Aufgaben kommen als Einträge in `src/content/goethe.ts` oder `src/content/telc.ts`. Die Strecke verweist in `src/content/tracks.ts` auf die Aufgaben-ID.

## Gestaltung

Farben, Schriftgrößen, Radien und Schatten stehen in `src/styles/tokens.css`. Komponenten benutzen nur diese Namen. Die Marke ist bis zur endgültigen Palette ein Blau (`#0B6BCB` im Hellen). Darstellung: Hell, Dunkel oder System, Schalter im Kopf, gespeichert unter `deutscheprobe-theme`, ohne Aufblitzen beim Laden.

Die Bausteine liegen in `src/components/ui` (Button, Card, Badge, SkillBadge, Chip, Tabs, Timer, ProgressBar, Input, Modal). `/design-system` zeigt Tokens und Komponenten.

## Skripte

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Deployment ohne Kosten

**Vercel Hobby.** Repository verbinden, Framework Next.js. Für den Demo-Modus sind keine Variablen nötig. Supabase und Gemini nur eintragen, wenn sie genutzt werden.

**Cloudflare Pages.** Die App ist ein gewöhnliches Next.js-Projekt ohne node-eigene Zusatzmodule. Für Pages den OpenNext-Adapter für Cloudflare verwenden (`@opennextjs/cloudflare`) und mit dem Next.js-Preset bauen. Auch dort reicht der Demo-Modus ohne Secrets. `GEMINI_API_KEY` bleibt serverseitig.

## Hinweise

Lesen, Hören und Sprachbausteine werden im Browser gewertet. Schreiben und Sprechen schickt nur Text, Notizen, Stichpunkte und die Dauer an `/api/feedback`, nicht die Audiodatei.
