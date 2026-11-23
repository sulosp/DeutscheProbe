import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20">
      <h1 className="text-h1 font-semibold">Seite nicht gefunden</h1>
      <p className="mt-2 text-muted">Diese Adresse gibt es in DeutscheProbe nicht.</p>
      <Button href="/" className="mt-6">
        Zur Startseite
      </Button>
    </main>
  );
}
