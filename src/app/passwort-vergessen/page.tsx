"use client";

import Link from "next/link";
import { useState } from "react";
import { Mark } from "@/components/logo";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { demoMode } from "@/lib/env";
import { getSupabase } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (demoMode || !getSupabase()) {
      setError("Im Demo-Modus wird kein Link verschickt. Das Passwort wird nicht gespeichert, es zählt nur die E-Mail in diesem Browser.");
      return;
    }
    if (!email.includes("@")) {
      setError("Bitte eine gültige E-Mail eintragen.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    setPending(true);
    const origin = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/callback?next=/passwort-zuruecksetzen`,
    });
    setPending(false);
    if (resetError) {
      setError("Der Link konnte nicht verschickt werden. Bitte versuche es in ein paar Minuten erneut.");
      return;
    }
    setSent(true);
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <Card className="p-6 md:p-8">
          <Mark />
          <h1 className="mt-4 text-h1 font-extrabold tracking-tight">Passwort vergessen</h1>
          {demoMode ? (
            <p className="mt-2 text-small text-muted">
              Im Demo-Modus wird kein Link verschickt. Das Passwort wird nicht gespeichert, es zählt nur die E-Mail in diesem Browser.
            </p>
          ) : (
            <p className="mt-2 text-small text-muted">
              Wir schicken einen Link zum Zurücksetzen. Er gilt nur für kurze Zeit.
            </p>
          )}
          {sent ? (
            <div className="mt-5 space-y-4">
              <p className="text-small text-success">
                Wenn ein Konto zu dieser E-Mail existiert, ist der Link unterwegs. Schau auch im Spam-Ordner nach.
              </p>
              <Button href="/anmelden" className="w-full">
                Zur Anmeldung
              </Button>
            </div>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={demoMode}
                />
              </div>
              <FieldError>{error}</FieldError>
              <Button type="submit" className="w-full" disabled={pending || demoMode}>
                Link senden
              </Button>
            </form>
          )}
          <p className="mt-4 text-small text-muted">
            <Link href="/anmelden" className="font-semibold text-brand-text">
              Zurück zur Anmeldung
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
