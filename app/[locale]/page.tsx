import { notFound } from "next/navigation";

import { isLocale, type Locale } from "../../i18n/routing";
import HomeClient, { type AppData } from "./HomeClient";

import dataPt from "../data/pt.json";
import dataEn from "../data/en.json";
import dataEs from "../data/es.json";

const dataByLocale: Record<Locale, AppData> = {
  pt: dataPt as AppData,
  en: dataEn as AppData,
  es: dataEs as AppData,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <HomeClient locale={locale} appData={dataByLocale[locale]} />;
}
