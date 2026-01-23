import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale } from "./routing";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const segmentLocale = await requestLocale;
  const requestedLocale = locale ?? segmentLocale ?? defaultLocale;
  const resolvedLocale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
