"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/shell/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, ScorePill, SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Tabs } from "@/components/ui/tabs";
import { Timer } from "@/components/ui/timer";
import { SKILL_ORDER } from "@/lib/skills";
import { useTheme } from "next-themes";

const swatches = [
  ["brand", "Marke"],
  ["brand-soft", "Marke, Fläche"],
  ["surface", "Hintergrund"],
  ["surface-raised", "Karte"],
  ["text", "Text"],
  ["text-muted", "Text, leise"],
  ["border", "Linie"],
  ["success", "Erfolg"],
  ["warn", "Hinweis"],
  ["error", "Fehler"],
  ["skill-sprechen", "Sprechen"],
  ["skill-hoeren", "Hören"],
  ["skill-lesen", "Lesen"],
  ["skill-schreiben", "Schreiben"],
  ["skill-sprachbausteine", "Sprachbausteine"],
] as const;

export default function DesignSystemPage() {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("hell");
  const [open, setOpen] = useState(false);
  const [activeChip, setActiveChip] = useState("B1");

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    swatches.forEach(([token]) => {
      next[token] = styles.getPropertyValue(`--${token}`).trim();
    });
    setValues(next);
  }, [resolvedTheme]);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-small font-semibold text-brand-text">DeutscheProbe</p>
            <h1 className="display mt-2">Design-System</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Alle Farben stehen in <code className="text-foreground">src/styles/tokens.css</code>. Die Marke ist vorerst ein Blau, Platzhalter #0B6BCB im Hellen. Hell, Dunkel und System teilen sich dieselben Namen.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section>
          <h2 className="text-h2 font-semibold">Farben</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {swatches.map(([token, label]) => (
              <Card key={token} className="flex items-center gap-3 p-3">
                <span className="h-12 w-12 shrink-0 rounded-lg border border-border" style={{ background: `var(--${token})` }} />
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-micro text-muted">--{token}</span>
                  <span className="block text-micro uppercase text-soft">{values[token]}</span>
                </span>
              </Card>
            ))}
          </div>
          <p className="mt-3 text-small text-muted">
            Lesen ist Himmelblau, Sprachbausteine ist Indigo. Erfolg ist blau, nicht grün. Die Balken nutzen die lebhaftere Stufe derselben Farbe.
          </p>
        </section>

        <section>
          <h2 className="text-h2 font-semibold">Schrift</h2>
          <div className="mt-4 space-y-3">
            <p className="display">Probeprüfung</p>
            <p className="text-h1 font-semibold">Überschrift eins</p>
            <p className="text-h2 font-semibold">Überschrift zwei</p>
            <p className="text-h3 font-semibold">Überschrift drei</p>
            <p className="text-lead">Einleitungstext für Erklärungen auf der Aufgabenseite.</p>
            <p>Fließtext in Inter, der Schrift der Oberfläche.</p>
            <p className="text-small text-muted">Kleiner Text für Metaangaben.</p>
            <p className="text-micro text-soft">Micro für Zeiten und Hinweise.</p>
          </div>
        </section>

        <section>
          <h2 className="text-h2 font-semibold">Komponenten</h2>
          <Card className="mt-4 space-y-5 p-5">
            <div className="flex flex-wrap gap-2">
              <Button>Primär</Button>
              <Button variant="secondary">Sekundär</Button>
              <Button variant="soft">Leise</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Stopp</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILL_ORDER.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
              <Badge>Beispieldaten</Badge>
              <ScorePill score={88} />
              <ScorePill score={64} />
              <ScorePill score={42} />
            </div>
            <div className="flex flex-wrap gap-2">
              {["A1", "A2", "B1", "B2"].map((level) => (
                <Chip key={level} active={activeChip === level} onClick={() => setActiveChip(level)}>
                  {level}
                </Chip>
              ))}
            </div>
            <Tabs
              label="Beispiel"
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "hell", label: "Hell" },
                { id: "dunkel", label: "Dunkel" },
                { id: "system", label: "System" },
              ]}
            />
            <div className="grid gap-3 md:grid-cols-2">
              {SKILL_ORDER.map((skill) => (
                <ProgressBar key={skill} value={72} skill={skill} label={skill} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Timer seconds={525} label="Prüfung" />
              <Timer seconds={42} label="Zeit" />
              <ScoreRing percent={69} />
            </div>
            <div className="max-w-sm">
              <Label htmlFor="demo-input">Eingabe</Label>
              <Input id="demo-input" placeholder="Dein Name" />
            </div>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Dialog öffnen
            </Button>
          </Card>
        </section>

        <section>
          <h2 className="text-h2 font-semibold">Radius, Schatten, Abstand</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-sm border border-border bg-raised p-4 shadow-sm">sm</div>
            <div className="rounded-xl border border-border bg-raised p-4 shadow-card">Karte</div>
            <div className="rounded-2xl border border-border bg-raised p-4 shadow-pop">groß</div>
          </div>
          <p className="mt-3 text-small text-muted">Seitenabstand {`var(--dp-space-page)`}, Abschnitt {`var(--dp-space-section)`}.</p>
        </section>
      </main>
      <Modal open={open} title="Dialog" onClose={() => setOpen(false)}>
        <p>Dialoge liegen über der Fläche und schließen mit Escape.</p>
        <Button className="mt-4" onClick={() => setOpen(false)}>
          Schließen
        </Button>
      </Modal>
    </div>
  );
}
