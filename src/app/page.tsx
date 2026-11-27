"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
              Kostenlos · ohne Abo · A1 bis B2
            </p>
            <h1 className="hero-title mt-5 text-foreground">
              Goethe und telc üben – inklusive <span className="gradient-text">Sprechen mit Timer</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lead text-muted">
              Kostenlos und ohne Abo: Goethe-Zertifikat und telc von A1 bis B2, mit zeitlich begrenztem Sprechen, Schreiben, Lesen und Hören.
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
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-raised p-4 shadow-card">
              <p className="text-small font-bold text-foreground">Eine Aufgabe sofort üben, ohne Konto</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  ["Lesen", "/probieren/lesen", IconBook],
                  ["Hören", "/probieren/hoeren", IconHeadphones],
                  ["Schreiben", "/probieren/schreiben", IconPen],
                  ["Sprechen", "/probieren/sprechen", IconMic],
                ].map(([label, href, Icon]) => (
                  <Link
                    key={href as string}
                    href={href as string}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-small font-semibold text-foreground hover:bg-sunken"
                  >
                    <Icon className="h-4 w-4" />
                    {label as string}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-12 max-w-6xl md:mt-16">
            <div
              className="pointer-events-none absolute -inset-x-4 -top-6 bottom-10 -z-10 rounded-[2rem] opacity-50 blur-3xl"
              style={{ backgroundImage: "var(--brand-gradient)" }}
              aria-hidden
            />
            <DashboardPreview />
            <p className="mt-4 text-center text-small text-muted">So sieht die Übersicht für Goethe B1 aus.</p>
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
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-small text-muted sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl">
            DeutscheProbe ist ein unabhängiges Werkzeug zur Prüfungsvorbereitung und nicht mit dem Goethe-Institut oder der telc gGmbH verbunden.
          </p>
          <nav className="flex shrink-0 gap-4 font-semibold" aria-label="Rechtliches">
            <Link href="/impressum" className="hover:text-foreground">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-foreground">
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
