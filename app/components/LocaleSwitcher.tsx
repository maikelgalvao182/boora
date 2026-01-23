"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "../../i18n/routing";

const localeLabel: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

function buildLocaleHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  // Replace first segment (current locale) with target locale.
  segments[0] = targetLocale;

  const base = `/${segments.join("/")}`;
  return base;
}

export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Seletor de idioma"
      className="rounded-full border border-gray-200 bg-white/90 backdrop-blur px-2 py-1 shadow-sm"
    >
      <ul className="flex items-center gap-1">
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          const href = buildLocaleHref(pathname, locale);

          return (
            <li key={locale}>
              <Link
                href={href}
                className={
                  isActive
                    ? "inline-flex items-center justify-center rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white"
                    : "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {localeLabel[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
