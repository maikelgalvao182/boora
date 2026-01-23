export const locales = ["pt", "en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export function isLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
