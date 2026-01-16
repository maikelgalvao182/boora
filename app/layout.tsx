import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Recommended for performance (swaps to Inter once loaded)
  variable: "--font-inter", // Define a CSS variable name
});

export const metadata: Metadata = {
  title: "Boora - Não vá sozinho",
  description: "Boora é um social map pra quem cansou de ficar em casa sozinho esperando convite. Crie atividades no mapa e veja quem mais tá na mesma vibe.",
  openGraph: {
    title: "Boora - Não vá sozinho",
    description: "Boora é um social map pra quem cansou de ficar em casa sozinho esperando convite. Crie atividades no mapa e veja quem mais tá na mesma vibe.",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boora - Não vá sozinho",
    description: "Boora é um social map pra quem cansou de ficar em casa sozinho esperando convite. Crie atividades no mapa e veja quem mais tá na mesma vibe.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
