"use client";

import { useParams } from "next/navigation";
import { PracticeTeil } from "@/components/full-exam/practice";
import { Button } from "@/components/ui/button";
import { findTeil } from "@/content/exams";

export default function TeilPracticePage() {
  const params = useParams<{ skill: string; teilId: string }>();
  const found = findTeil(params.teilId);
  if (!found || found.module.skill !== params.skill) {
    return (
      <div>
        <p className="text-muted">Diesen Teil gibt es nicht.</p>
        <Button href="/uebersicht" className="mt-4">
          Zur Übersicht
        </Button>
      </div>
    );
  }
  return <PracticeTeil module={found.module} teil={found.teil} />;
}