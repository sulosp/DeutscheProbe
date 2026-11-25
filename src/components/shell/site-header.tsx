"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-raised/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Logo />
        <nav className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link href="/anmelden" className="hidden rounded-full px-3 py-2 text-small font-semibold text-muted hover:text-foreground md:inline">
            Anmelden
          </Link>
          <Button href="/registrieren" size="sm">
            Konto erstellen
          </Button>
        </nav>
      </div>
    </header>
  );
}
