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
    title: number ? `Prüfungsteil ${number}` : "Prüfungsteil",
    description: number
      ? `Teil ${number} der Probeprüfung. Die Auswertung kommt erst am Ende.`
      : "Dieser Teil der Probeprüfung existiert nicht.",
    path: `/probe/teil/${encodeURIComponent(index)}`,
  });
}

export default function ProbeTeilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
