import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getLocale } from "next-intl/server";
import Script from "next/script";
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
      <head>
        <Script id="twitter-uwt-base" strategy="beforeInteractive">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','r55je');
          `}
        </Script>
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <Script id="twitter-conversion-event" strategy="afterInteractive">
          {`
            twq('event', 'tw-r55je-r55pf', {
              value: 0,
              currency: 'BRL'
            });
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
