import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Recommended for performance (swaps to Inter once loaded)
  variable: "--font-inter", // Define a CSS variable name
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
