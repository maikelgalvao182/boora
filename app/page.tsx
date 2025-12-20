"use client";

import { ArrowRight, Share2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StarRating from "./components/StarRating";
import appData from "./data.json";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const screenshotsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeRef, setActiveRef] = useState<'screenshots' | 'reviews' | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const container = activeRef === 'screenshots' ? screenshotsRef.current : reviewsRef.current;
      if (!container) return;
      const x = e.pageX;
      const walk = (startX - x);
      container.scrollLeft = scrollLeft + walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const container = activeRef === 'screenshots' ? screenshotsRef.current : reviewsRef.current;
      if (container) {
        container.style.cursor = 'grab';
        container.style.scrollBehavior = 'smooth';
        container.style.scrollSnapType = 'x mandatory';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft, activeRef]);

  const handleMouseDown = (e: React.MouseEvent, ref: 'screenshots' | 'reviews') => {
    e.preventDefault();
    const container = ref === 'screenshots' ? screenshotsRef.current : reviewsRef.current;
    if (!container) return;
    setIsDragging(true);
    setActiveRef(ref);
    setStartX(e.pageX);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.scrollBehavior = 'auto';
    container.style.scrollSnapType = 'none';
  };

  const checkTextOverflow = () => {
    if (descriptionRef.current) {
      // Temporarily remove line-clamp to measure full height
      const originalClasses = descriptionRef.current.className;
      descriptionRef.current.classList.remove("line-clamp-2");

      const lineHeight = parseFloat(
        getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2; // 2 lines
      const actualHeight = descriptionRef.current.scrollHeight;

      // Restore original classes
      descriptionRef.current.className = originalClasses;

      setShouldShowMore(actualHeight > maxHeight);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkTextOverflow();
    }, 100);
    window.addEventListener("resize", checkTextOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkTextOverflow);
    };
  }, []);

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(appData.app.liveAppLink);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <main className="max-w-4xl mx-auto p-5 pt-10 pb-20">
        <section className="flex flex-col items-center text-center mb-8">
          <Image
            src={appData.app.icon}
            alt="App Icon"
            width={90}
            height={90}
            className="pb-6"
          />
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-4 md:max-w-lg mx-auto">
            {appData.app.name}
          </h1>
          <p className="text-base sm:text-lg text-primary/80 font-normal max-w-xl">
            {appData.app.developer}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={() => window.open('https://apps.apple.com/br/app/boora/id6755944656', '_blank')}
              className="bg-[#5BAD46] hover:bg-[#7BCEC0] active:bg-[#6BBDAE] text-white font-bold rounded-full px-6 py-2 text-sm transition-colors"
            >
              {appData.app.buttonText}
            </button>
          </div>
        </section>

        <hr className="border-gray-200 mb-6" />

        {/* Screenshots Section */}
        <section className="mb-8">
          <div 
            ref={screenshotsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide snap-x cursor-grab select-none"
            onMouseDown={(e) => handleMouseDown(e, 'screenshots')}
          >
            {appData.screenshots.map((screenshot, i) => (
              <div
                key={i}
                className="shrink-0 w-[240px] h-[520px] rounded-[32px] overflow-hidden border border-gray-100 relative bg-gray-100 snap-center"
              >
                <Image
                  src={screenshot}
                  alt={`Screenshot ${i + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-6" />

        <section className="mb-6">
          <p className="text-sm leading-relaxed text-primary/80 whitespace-pre-line">
            {appData.description}
          </p>
        </section>

        <hr className="border-gray-200 mb-6" />

        {/* Ratings & Reviews Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold tracking-tight">
              Avaliações e Comentários
            </h2>
            <button 
              onClick={() => window.open('https://apps.apple.com/br/app/boora/id6755944656', '_blank')}
              className="text-[#5BAD46] text-xs font-medium"
            >
              Ver Tudo
            </button>
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tighter">
                {appData.ratings.overall}
              </span>
              <span className="text-sm font-bold text-gray-400 mt-1">
                de 5
              </span>
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
                      <div
                        className="h-full bg-gray-500 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <div className="text-right text-xs text-gray-400 mt-1">
                {appData.ratings.totalRatings >= 1000
                  ? `${(appData.ratings.totalRatings / 1000).toFixed(1)}K`
                  : appData.ratings.totalRatings}{" "}
                Avaliações
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div 
            ref={reviewsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide snap-x cursor-grab select-none"
            onMouseDown={(e) => handleMouseDown(e, 'reviews')}
          >
            {appData.reviews.map((review, i) => (
              <div
                key={i}
                className="bg-gray-50 p-5 rounded-[20px] w-[300px] shrink-0 snap-center"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm line-clamp-1">
                    {review.title}
                  </h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {review.date}
                  </span>
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
                <p className="text-sm text-gray-600 leading-normal line-clamp-6">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-5">
          <Link
            href="https://instagram.com/boora_app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-xs sm:text-sm font-medium"
          >
            Instagram
          </Link>
          <Link
            href="https://tiktok.com/@boora.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-xs sm:text-sm font-medium"
          >
            TikTok
          </Link>
          <Link
            href="/politica-de-privacidade"
            className="text-black text-xs sm:text-sm font-medium"
          >
            Privacidade
          </Link>
          <Link
            href="/termos-de-servico"
            className="text-black text-xs sm:text-sm font-medium"
          >
            Termos
          </Link>
          <Link
            href="/seguranca-etiqueta"
            className="text-black text-xs sm:text-sm font-medium"
          >
            Segurança
          </Link>
          <Link
            href="/diretrizes-da-comunidade"
            className="text-black text-xs sm:text-sm font-medium"
          >
            Diretrizes
          </Link>
        </div>
      </main>
    </div>
  );
}
