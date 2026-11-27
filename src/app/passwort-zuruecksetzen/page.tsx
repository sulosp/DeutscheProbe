"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "@/components/logo";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { demoMode } from "@/lib/env";
import { useAppState } from "@/lib/storage";
import { getSupabase, pullProfile } from "@/lib/supabase/browser";

type Status = "loading" | "demo" | "ready" | "missing" | "saved";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { adopt } = useAppState();
  const [status, setStatus] = useState<Status>(demoMode ? "demo" : "loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (demoMode) return;
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("demo");
      return;
    }
    let active = true;
    void supabase.auth.getUser().then(({ data, error: userError }) => {
      if (!active) return;
      setStatus(!userError && data.user ? "ready" : "missing");
    });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Mindestens 6 Zeichen.");
      return;
    }
    if (password !== confirm) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setError("Im Demo-Modus gibt es kein Passwort auf dem Server.");
      return;
    }
    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(passwordUpdateMessage(updateError.message));
      return;
    }
    setStatus("saved");
  }

  async function continueAfterSave() {
    const remote = await pullProfile().catch(() => null);
    if (remote) adopt(remote);
    router.push(remote && !remote.onboarded ? "/onboarding" : "/uebersicht");
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <Card className="p-6 md:p-8">
          <Mark />
          <h1 className="mt-4 text-h1 font-extrabold tracking-tight">Neues Passwort</h1>
          {status === "loading" ? <p className="mt-2 text-small text-muted">Einen Moment …</p> : null}
          {status === "demo" ? (
            <p className="mt-2 text-small text-muted">
              Im Demo-Modus gibt es kein Passwort auf dem Server. Melde dich mit der E-Mail an, die in diesem Browser gespeichert ist.
            </p>
          ) : null}
          {status === "missing" ? (
            <div className="mt-2 space-y-4">
              <p className="text-small text-muted">
                Dieser Link ist ungültig oder abgelaufen. Fordere einen neuen Link an.
              </p>
              <Button href="/passwort-vergessen" className="w-full">
                Neuen Link anfordern
              </Button>
            </div>
          ) : null}
          {status === "ready" ? (
            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <p className="text-small text-muted">Mindestens 6 Zeichen. Danach gilt das neue Passwort.</p>
              <div>
                <Label htmlFor="password">Neues Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirm">Passwort wiederholen</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <FieldError>{error}</FieldError>
              <Button type="submit" className="w-full" disabled={pending}>
                Passwort speichern
              </Button>
            </form>
          ) : null}
          {status === "saved" ? (
            <div className="mt-5 space-y-4">
              <p className="text-small text-success">Das Passwort wurde gespeichert.</p>
              <Button className="w-full" onClick={() => void continueAfterSave()}>
                Weiter
              </Button>
            </div>
          ) : null}
          <p className="mt-4 text-small text-muted">
            <Link href="/anmelden" className="font-semibold text-brand-text">
              Zur Anmeldung
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}

function passwordUpdateMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("session") || lower.includes("jwt") || lower.includes("expired") || lower.includes("auth")) {
    return "Die Sitzung ist abgelaufen. Fordere einen neuen Link an.";
  }
  if (lower.includes("weak") || lower.includes("at least") || lower.includes("short")) {
    return "Das Passwort ist zu kurz oder zu schwach. Mindestens 6 Zeichen.";
  }
  if (lower.includes("same") || lower.includes("different")) {
    return "Das neue Passwort muss sich vom bisherigen unterscheiden.";
  }
  return "Das Passwort konnte nicht gespeichert werden. Bitte versuche es erneut.";
}
