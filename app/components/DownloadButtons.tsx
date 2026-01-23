import type { Locale } from "../../i18n/routing";

type Props = {
  locale: Locale;
  appStoreUrl?: string;
  playStoreUrl?: string;
};

const BADGES: Record<Locale, { apple: string; play: string }> = {
  pt: {
    apple: "/button/ApplePT.png",
    play: "/button/playPT.png",
  },
  en: {
    apple: "/button/AppleEN.png",
    play: "/button/playEN.png",
  },
  es: {
    apple: "/button/AppleES.png",
    play: "/button/PlayES.png",
  },
};

const ALT_TEXT: Record<Locale, { apple: string; play: string }> = {
  pt: { apple: "Baixar na App Store", play: "Baixar no Google Play" },
  en: { apple: "Download on the App Store", play: "Get it on Google Play" },
  es: { apple: "Descargar en App Store", play: "Consíguelo en Google Play" },
};

function isNonEmptyUrl(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export default function DownloadButtons({ locale, appStoreUrl, playStoreUrl }: Props) {
  const badges = BADGES[locale];
  const alt = ALT_TEXT[locale];

  const items: Array<{
    href: string;
    src: string;
    alt: string;
  }> = [];

  if (isNonEmptyUrl(appStoreUrl)) {
    items.push({
      href: appStoreUrl,
      src: badges.apple,
      alt: alt.apple,
    });

    items.push({
      href: isNonEmptyUrl(playStoreUrl) ? playStoreUrl : appStoreUrl,
      src: badges.play,
      alt: alt.play,
    });
  }

  if (!isNonEmptyUrl(appStoreUrl) && isNonEmptyUrl(playStoreUrl)) {
    items.push({
      href: playStoreUrl,
      src: badges.play,
      alt: alt.play,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-row flex-wrap items-center justify-center gap-3">
      {items.map((item) => (
        <a
          key={item.src}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="eager"
            className="block h-auto w-auto max-h-12 max-w-[150px] sm:max-w-[180px]"
          />
        </a>
      ))}
    </div>
  );
}
