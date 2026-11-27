import type { Metadata } from "next";
import { privatePage } from "@/lib/seo";

type Props = { params: Promise<{ index: string }> };

function partNumber(index: string) {
  const n = Number(index);
  if (!Number.isInteger(n) || n < 0) return null;
  return n + 1;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { index } = await params;
  const number = partNumber(index);
  return privatePage({
    title: number ? `Übergang ${number}` : "Übergang",
    description: number
      ? `Kurze Pause vor Teil ${number} der Probeprüfung.`
      : "Kurze Pause zwischen zwei Teilen der Probeprüfung.",
    path: `/probe/uebergang/${encodeURIComponent(index)}`,
  });
}

export default function UebergangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
