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
import type { Profile } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { registerDemo, adopt, startDemo } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Bitte einen Namen eintragen.");
      return;
    }
    if (!email.includes("@") || password.length < 6) {
      setError("E-Mail und mindestens 6 Zeichen beim Passwort.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      registerDemo({ name, email });
      router.push("/onboarding");
      return;
    }
    setPending(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setPending(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    const profile: Profile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      exam: "goethe",
      level: "B1",
      goal: "",
      examInDays: 30,
      onboarded: false,
      auth: "supabase",
    };
    adopt(profile);
    router.push("/onboarding");
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <Card className="p-6 md:p-8">
          <Mark />
          <h1 className="mt-4 text-h1 font-extrabold tracking-tight">Konto erstellen</h1>
          <p className="mt-2 text-small text-muted">
            {demoMode ? "Demo-Modus: das Konto bleibt in diesem Browser." : "E-Mail oder Google. Danach wählst du Prüfung und Niveau."}
          </p>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" className="w-full" disabled={pending}>
              Weiter zur Auswahl
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
            Schon ein Konto? <Link href="/anmelden" className="font-semibold text-brand-text">Anmelden</Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
