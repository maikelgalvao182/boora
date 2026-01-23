"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale } from "../../i18n/routing";

interface HeaderProps {
  locale: Locale;
  logoSrc: string;
}

export default function Header({ locale, logoSrc }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        // No topo da página
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down e passou de 50px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={logoSrc}
            alt="Logo"
            width={90}
            height={90}
            className="object-contain"
          />
        </div>
        
        <LocaleSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
