"use client";

import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import StarRating from "../components/StarRating";
import DownloadButtons from "../components/DownloadButtons";
import Header from "../components/Header";
import type { Locale } from "../../i18n/routing";

export type AppData = {
  app: {
    icon: string;
    name: string;
    ageRating: string;
    developer: string;
    priceType: string;
    overallRating: number;
    totalRatings: number;
    buttonText: string;
    liveAppLink: string;
    appStoreLink?: string;
    playStoreLink?: string;
  };
  screenshots: string[];
  description: string;
  whatsNew: {
    version: string;
    content: string;
  };
  ratings: {
    overall: number;
    totalRatings: number;
    distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  };
  reviews: Array<{
    title: string;
    user: string;
    date: string;
    rating: number;
    content: string;
  }>;
  information: Record<string, unknown>;
};

export default function HomeClient({
  locale,
  appData,
}: {
  locale: Locale;
  appData: AppData;
}) {
  const highlightPhraseByLocale: Partial<Record<Locale, string>> = {
    pt: "correr no parque, cinema, tomar vinho",
    en: "run in the park, go to the movies, have a glass of wine",
    es: "correr en el parque, cine, tomar vino",
  };

  const highlightPhrase = highlightPhraseByLocale[locale];
  const developerText = appData.app.developer;

  const renderDeveloper = () => {
    if (!highlightPhrase) return developerText;
    const index = developerText.indexOf(highlightPhrase);
    if (index === -1) return developerText;

    return (
      <>
        {developerText.slice(0, index)}
        <span className="text-primary font-medium">{highlightPhrase}</span>
        {developerText.slice(index + highlightPhrase.length)}
      </>
    );
  };

  const tHome = useTranslations("Home");
  const tCommon = useTranslations("Common");

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const screenshotsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeRef, setActiveRef] = useState<"screenshots" | "reviews" | null>(null);
  const hasDragged = useRef(false);

  const lightboxTouchStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      hasDragged.current = true;
      const container = activeRef === "screenshots" ? screenshotsRef.current : reviewsRef.current;
      if (!container) return;

      const x = e.pageX;
      const walk = startX - x;
      container.scrollLeft = scrollLeft + walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const container = activeRef === "screenshots" ? screenshotsRef.current : reviewsRef.current;
      if (container) {
        container.style.cursor = "grab";
        container.style.scrollBehavior = "smooth";
        container.style.scrollSnapType = "x mandatory";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft, activeRef]);

  const handleMouseDown = (e: React.MouseEvent, ref: "screenshots" | "reviews") => {
    e.preventDefault();
    hasDragged.current = false;

    const container = ref === "screenshots" ? screenshotsRef.current : reviewsRef.current;
    if (!container) return;

    setIsDragging(true);
    setActiveRef(ref);
    setStartX(e.pageX);
    setScrollLeft(container.scrollLeft);

    container.style.cursor = "grabbing";
    container.style.scrollBehavior = "auto";
    container.style.scrollSnapType = "none";
  };

  const handleScreenshotClick = (index: number) => {
    if (!hasDragged.current) setLightboxIndex(index);
  };

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? appData.screenshots.length - 1 : prev - 1
    );
  }, [appData.screenshots.length]);

  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === appData.screenshots.length - 1 ? 0 : prev + 1
    );
  }, [appData.screenshots.length]);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStart.current = e.touches[0].clientX;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = lightboxTouchStart.current - touchEnd;
    const threshold = 50;

    if (diff > threshold) handleLightboxNext();
    else if (diff < -threshold) handleLightboxPrev();

    lightboxTouchStart.current = null;
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleLightboxPrev();
      if (e.key === "ArrowRight") handleLightboxNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handleLightboxNext, handleLightboxPrev]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Header locale={locale} logoSrc="/logo.png" />
      
      <main className="max-w-4xl mx-auto p-5 pt-24 pb-20">
        <section className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-4 md:max-w-lg mx-auto">
            {appData.app.name}
          </h1>
          <p className="text-base sm:text-lg text-primary/80 font-normal max-w-xl">{renderDeveloper()}</p>
          <DownloadButtons
            locale={locale}
            appStoreUrl={appData.app.appStoreLink ?? appData.app.liveAppLink}
            playStoreUrl={appData.app.playStoreLink}
          />
        </section>

        <hr className="border-gray-200 mb-6" />

        <section className="mb-8">
          <div
            ref={screenshotsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide snap-x cursor-grab select-none"
            onMouseDown={(e) => handleMouseDown(e, "screenshots")}
          >
            {appData.screenshots.map((screenshot, i) => (
              <div
                key={i}
                className="shrink-0 w-[240px] h-[520px] rounded-[32px] overflow-hidden border border-gray-100 relative bg-gray-100 snap-center cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => handleScreenshotClick(i)}
              >
                <Image src={screenshot} alt={`Screenshot ${i + 1}`} fill className="object-cover pointer-events-none" draggable={false} />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-6" />

        <section className="mb-6">
          <p 
            className="text-sm leading-relaxed text-primary/80 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: appData.description }}
          />
        </section>

        <hr className="border-gray-200 mb-6" />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold tracking-tight">{tHome("reviewsTitle")}</h2>
            <button
              onClick={() => window.open(appData.app.liveAppLink, "_blank")}
              className="text-[#5BAD46] text-xs font-medium"
            >
              {tCommon("viewAll")}
            </button>
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tighter">{appData.ratings.overall}</span>
              <span className="text-sm font-bold text-gray-400 mt-1">{tHome("outOfFive")}</span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingKey = String(rating) as "5" | "4" | "3" | "2" | "1";
                const percentage = appData.ratings.distribution[ratingKey] || 0;
                return (
                  <div key={rating} className="flex items-center gap-2 h-2">
                    <div className="flex justify-end w-4">
                      <Star className="w-2 h-2 text-gray-400 fill-gray-400" />
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="text-right text-xs text-gray-400 mt-1">
                {appData.ratings.totalRatings >= 1000
                  ? `${(appData.ratings.totalRatings / 1000).toFixed(1)}K`
                  : appData.ratings.totalRatings}{" "}
                {tHome("ratings")}
              </div>
            </div>
          </div>

          <div
            ref={reviewsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide snap-x cursor-grab select-none"
            onMouseDown={(e) => handleMouseDown(e, "reviews")}
          >
            {appData.reviews.map((review, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-[20px] w-[300px] shrink-0 snap-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm line-clamp-1">{review.title}</h3>
                  <span className="text-xs text-gray-400 shrink-0">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <StarRating
                    rating={review.rating}
                    size="sm"
                    filledColor="text-orange-400 fill-orange-400"
                    emptyColor="text-gray-300"
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">{review.user}</span>
                </div>
                <p className="text-sm text-gray-600 leading-normal line-clamp-6">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-5">
          <Link href="https://instagram.com/boora_app" target="_blank" rel="noopener noreferrer" className="text-black text-xs sm:text-sm font-medium">
            {tCommon("instagram")}
          </Link>
          <Link href="https://tiktok.com/@boora.app" target="_blank" rel="noopener noreferrer" className="text-black text-xs sm:text-sm font-medium">
            {tCommon("tiktok")}
          </Link>
          <Link href={`/${locale}/politica-de-privacidade`} className="text-black text-xs sm:text-sm font-medium">
            {tCommon("privacy")}
          </Link>
          <Link href={`/${locale}/termos-de-servico`} className="text-black text-xs sm:text-sm font-medium">
            {tCommon("terms")}
          </Link>
          <Link href={`/${locale}/seguranca-etiqueta`} className="text-black text-xs sm:text-sm font-medium">
            {tCommon("safety")}
          </Link>
          <Link href={`/${locale}/diretrizes-da-comunidade`} className="text-black text-xs sm:text-sm font-medium">
            {tCommon("guidelines")}
          </Link>
        </div>
      </main>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setLightboxIndex(null)}
            aria-label={tHome("lightboxClose")}
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxPrev();
            }}
            aria-label={tHome("previous")}
          >
            <ChevronLeft size={40} />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxNext();
            }}
            aria-label={tHome("next")}
          >
            <ChevronRight size={40} />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw] w-auto h-auto touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <Image
              src={appData.screenshots[lightboxIndex]}
              alt={`Screenshot ${lightboxIndex + 1}`}
              width={400}
              height={867}
              className="max-h-[90vh] w-auto h-auto object-contain rounded-[32px] select-none"
              draggable={false}
              priority
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {appData.screenshots.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? "bg-white" : "bg-white/40"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                aria-label={tHome("goToScreenshot", { number: i + 1 })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
