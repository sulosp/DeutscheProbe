"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/logo";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { demoMode } from "@/lib/env";
import { useAppState } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/browser";

export default function SignInPage() {
  const router = useRouter();
  const { signInDemo, startDemo } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("E-Mail und mindestens 6 Zeichen beim Passwort.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      if (!signInDemo(email)) {
        setError("Dieses Konto liegt nicht in diesem Browser. Lege eins an oder sieh dir das Beispiel an.");
        return;
      }
      router.push("/uebersicht");
      return;
    }
    setPending(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/uebersicht");
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <Card className="p-6 md:p-8">
          <Mark />
          <h1 className="mt-4 text-h1 font-extrabold tracking-tight">Anmelden</h1>
          <p className="mt-2 text-small text-muted">
            {demoMode ? "Demo-Modus: das Passwort wird nicht gespeichert. Es zählt die E-Mail in diesem Browser." : "Mit E-Mail oder Google."}
          </p>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" className="w-full" disabled={pending}>
              Anmelden
            </Button>
          </form>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => {
              if (demoMode) {
                startDemo();
                router.push("/uebersicht");
                return;
              }
              const supabase = getSupabase();
              if (!supabase) return;
              void supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            }}
          >
            Mit Google fortfahren
          </Button>
          <p className="mt-4 text-small text-muted">
            Noch kein Konto? <Link href="/registrieren" className="font-semibold text-brand-text">Registrieren</Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
