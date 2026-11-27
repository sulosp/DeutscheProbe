"use client";

import { useRouter } from "next/navigation";
import { IconArrow, IconBook, IconHeadphones, IconMic, IconPen } from "@/components/icons";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { SiteHeader } from "@/components/shell/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/storage";

const reasons = [
  { title: "Acht Strecken", text: "Goethe und telc, jeweils A1 bis B2. Sprachbausteine gibt es bei telc B1 und B2." },
  { title: "Sprechen mit Aufnahme", text: "Die Aufnahme bleibt im Browser. Schreiben und Sprechen können über Gemini eingeschätzt werden, sonst über die Demo." },
  { title: "Probeprüfung mit Timer", text: "Teile in der öffentlichen Reihenfolge, Übergänge, Ergebnis und Auswertung erst am Ende." },
];

const tour = [
  { title: "Übersicht", text: "Prüfung und Niveau wechseln, Fortschritt sehen.", icon: IconBook },
  { title: "Aufgabe", text: "Lesen und Hören werden sofort gewertet.", icon: IconHeadphones },
  { title: "Sprechen", text: "Vorbereitung, Aufnahme, Stichpunkte.", icon: IconMic },
  { title: "Probe", text: "Start, Teile, Übergang, Ergebnis, Auswertung.", icon: IconPen },
];

export default function HomePage() {
  const router = useRouter();
  const { startDemo } = useAppState();

  return (
    <div className="relative overflow-x-hidden">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" aria-hidden />
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-small font-bold text-brand-text">
              Kostenlos · Goethe und telc · A1 bis B2
            </p>
            <h1 className="hero-title mt-5 text-foreground">
              Kostenlos für Goethe und telc üben – auch <span className="gradient-text">Sprechen und Schreiben</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lead text-muted">
              Probeprüfungen mit Timer, Aufgaben zum Lesen, Hören, Schreiben und Sprechen. Alles mit eigenen Beispieldaten, ohne Abo.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/registrieren" size="lg">
                Konto erstellen <IconArrow />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  startDemo();
                  router.push("/uebersicht");
                }}
              >
                Beispiel ansehen
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-12 max-w-6xl md:mt-16">
            <div
              className="pointer-events-none absolute -inset-x-4 -top-6 bottom-10 -z-10 rounded-[2rem] opacity-50 blur-3xl"
              style={{ backgroundImage: "var(--brand-gradient)" }}
              aria-hidden
            />
            <DashboardPreview />
            <p className="mt-4 text-center text-small text-muted">So sieht die Übersicht aus · Goethe B1, Beispieldaten</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-3 px-4 py-12 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Card key={reason.title} className="p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft font-display text-small font-extrabold text-brand-text">
                {index + 1}
              </span>
              <h2 className="mt-4 text-h3 font-bold">{reason.title}</h2>
              <p className="mt-2 text-small text-muted">{reason.text}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-h1 font-extrabold tracking-tight">Was du durchklicken kannst</h2>
          <p className="mt-2 max-w-2xl text-muted">Dieselbe Oberfläche wie nach dem Anmelden: Strecke, Aufgabe, Aufnahme und Probeprüfung.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {tour.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-softer text-brand-text">
                    <Icon />
                  </span>
                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-small text-muted">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-6 text-small text-muted">
          <span>DeutscheProbe · Beispieldaten, keine Verbindung zu Goethe-Institut oder telc.</span>
        </div>
      </footer>
    </div>
  );
}
