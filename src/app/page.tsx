"use client";

import { useRouter } from "next/navigation";
import { IconArrow } from "@/components/icons";
import { SiteHeader } from "@/components/shell/site-header";
import { SkillBadge } from "@/components/ui/badge";
import { BrandPanel, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAppState } from "@/lib/storage";

const reasons = [
  { title: "Acht Strecken", text: "Goethe und telc, jeweils A1 bis B2. Sprachbausteine gibt es bei telc B1 und B2." },
  { title: "Sprechen mit Aufnahme", text: "Die Aufnahme bleibt im Browser. Schreiben und Sprechen können über Gemini eingeschätzt werden, sonst über die Demo." },
  { title: "Probeprüfung mit Timer", text: "Teile in der öffentlichen Reihenfolge, Übergänge, Ergebnis und Auswertung erst am Ende." },
];

export default function HomePage() {
  const router = useRouter();
  const { startDemo } = useAppState();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div>
            <p className="text-small font-semibold text-brand-text">Kostenlos · Goethe und telc · A1 bis B2</p>
            <h1 className="display mt-3 text-foreground">Kostenlos für Goethe und telc üben – auch Sprechen und Schreiben</h1>
            <p className="mt-4 max-w-xl text-lead text-muted">
              Probeprüfungen mit Timer, Aufgaben zum Lesen, Hören, Schreiben und Sprechen. Alles mit eigenen Beispieldaten, ohne Abo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
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
          <BrandPanel className="p-5">
            <p className="text-small text-white/80">So sieht die Übersicht aus</p>
            <h2 className="mt-2 text-h2 font-semibold">Komplette Probeprüfung starten</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Lesen 65 Min.", "Hören 40 Min.", "Schreiben 60 Min.", "Sprechen 15 Min."].map((item) => (
                <span key={item} className="rounded-full bg-white/15 px-3 py-1 text-micro font-semibold">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              <Card className="bg-raised/95 p-3 text-foreground">
                <div className="flex items-center justify-between">
                  <SkillBadge skill="lesen" />
                  <span className="font-semibold">83%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={83} skill="lesen" />
                </div>
              </Card>
              <Card className="bg-raised/95 p-3 text-foreground">
                <div className="flex items-center justify-between">
                  <SkillBadge skill="sprechen" />
                  <span className="font-semibold">58%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={58} skill="sprechen" />
                </div>
              </Card>
            </div>
          </BrandPanel>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {reasons.map((reason) => (
            <Card key={reason.title} className="p-5">
              <h2 className="text-h3 font-semibold">{reason.title}</h2>
              <p className="mt-2 text-small text-muted">{reason.text}</p>
            </Card>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-h2 font-semibold">Was du durchklicken kannst</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              ["Übersicht", "Prüfung und Niveau wechseln, Fortschritt sehen."],
              ["Aufgabe", "Lesen und Hören werden sofort gewertet."],
              ["Sprechen", "Vorbereitung, Aufnahme, Stichpunkte."],
              ["Probe", "Start, Teile, Übergang, Ergebnis, Auswertung."],
            ].map(([title, text]) => (
              <Card key={title} className="p-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-small text-muted">{text}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-small text-muted">
          <span>DeutscheProbe · Beispieldaten, keine Verbindung zu Goethe-Institut oder telc.</span>
          <Button href="/design-system" variant="ghost" size="sm">
            Design-System
          </Button>
        </div>
      </footer>
    </div>
  );
}
