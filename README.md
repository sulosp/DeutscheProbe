# DeutscheProbe

Kostenlose Web-App zum Üben der Goethe- und telc-Prüfungen Deutsch A1 bis B2. Lesen, Hören, Schreiben, Sprechen und, bei telc B1 und B2, Sprachbausteine.

Goethe und telc, jeweils A1 bis B2, haben je einen vollständigen Modellsatz: Module in der Prüfungsreihenfolge, alle Teile mit Aufgabenzahl, Zeit und, beim Hören, Anzahl der Wiedergaben. Bei telc B1 und B2 gehören die Sprachbausteine dazu. Alle Texte sind eigene Beispieldaten. DeutscheProbe ist nicht mit dem Goethe-Institut oder telc verbunden und verwendet keine Prüfungslogos und keine offiziellen Aufgaben.

## Demo-Modus

Ohne Umgebungsvariablen läuft die App lokal im Browser:

- Konto, Ziel und Versuche liegen in `localStorage`
- eine laufende Probeprüfung liegt in `sessionStorage`
- Schreiben und Sprechen bekommen eine eingebaute Einschätzung
- Hören in allen acht Modellsätzen spielt vorbereitete Aufnahmen ab
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
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` | `true` zeigt „Mit Google fortfahren“. Sonst bleibt der Button aus |
| `SUPABASE_SERVICE_ROLE_KEY` | Dienstschlüssel nur auf dem Server, zum Löschen des Kontos |
| `GEMINI_API_KEY` | Einschätzung für Schreiben und Sprechen, Free Tier |
| `GEMINI_MODEL` | Standard `gemini-2.0-flash` |

Supabase: E-Mail unter Authentication aktivieren, `.../auth/callback` als Redirect eintragen, dann `supabase/schema.sql` im SQL-Editor ausführen. Google ist optional und erscheint erst, wenn `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` auf `true` steht. Zum Löschen eines Kontos braucht der Server `SUPABASE_SERVICE_ROLE_KEY`. Profile und Versuche sind mit Row Level Security auf die eigene Nutzerin beschränkt.

Ohne `GEMINI_API_KEY` antwortet `/api/feedback` mit der Demo-Einschätzung.

## Strecken

Acht Übersichten: Goethe und telc, jeweils A1, A2, B1, B2. Prüfung und Niveau lassen sich auf der Übersicht wechseln.

Die Goethe-Modellsätze liegen unter `src/content/exams/goethe-a1`, `goethe-a2`, `goethe-b1` und `goethe-b2`. B1 im Einzelnen: Lesen 65 Minuten (Teile 1–5, Aufgaben 1–30), Hören etwa 40 Minuten plus fünf Minuten Antwortbogen (Teile 1–4, Aufgaben 1–30, Texte ein- oder zweimal), Schreiben 60 Minuten (drei Aufgaben), Sprechen etwa 15 Minuten plus 15 Minuten Vorbereitung. Jedes Modul gilt ab 60 von 100 Punkten als bestanden. Lesen und Hören rechnen 30 Rohpunkte auf 100 um. Im Prüfungsmodus läuft Hören ohne Pause und ohne Zurückspulen. Einzelne Teile lassen sich unter Üben mit sofortiger Lösung wiederholen.

Die Hördateien liegen in `public/audio/` und `public/audio/cues`. Jede Rolle hat eine eigene Stimme. Ansagen, Telefon, Radio, Café und Vortrag bekommen eine leise, im Build erzeugte Raumfarbe; die Lizenzen stehen in `public/audio/ambience/LICENSES.md`. Neu erzeugen, nachdem `edge-tts` und ffmpeg installiert sind:

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

Farben, Schriftgrößen, Radien und Schatten stehen in `src/styles/tokens.css`. Komponenten benutzen nur diese Namen. Im Hellen sind Violett, Pink und Blau helle Töne mit dunkler Schrift. Im Dunkeln bleibt die Marke ein kräftiges Violett (`#6647F0`). Überschriften nutzen Plus Jakarta Sans, Fließtext Inter. Erfolg ist blau, nicht grün. Darstellung: Hell (Standard), Dunkel oder System, Schalter im Kopf, gespeichert unter `deutscheprobe-theme`, ohne Aufblitzen beim Laden.

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
