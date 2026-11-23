"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
      <Logo />
      <nav className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link href="/anmelden" className="hidden rounded-full px-3 py-2 text-small font-semibold text-muted sm:inline">
          Anmelden
        </Link>
        <Button href="/registrieren" size="sm">
          Konto erstellen
        </Button>
      </nav>
    </header>
  );
}
