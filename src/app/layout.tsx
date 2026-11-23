import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "DeutscheProbe",
    template: "%s · DeutscheProbe",
  },
  description: "Kostenlos Goethe und telc üben: Lesen, Hören, Schreiben, Sprechen und Probeprüfungen. Beispieldaten, kein Abo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
