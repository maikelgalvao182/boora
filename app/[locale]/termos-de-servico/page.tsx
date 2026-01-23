import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { isLocale } from "../../../i18n/routing";
import { readAppContentMdx } from "../../../lib/mdx";

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const source = await readAppContentMdx(locale, "terms-of-service.mdx");

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-4xl mx-auto p-5 pt-10 pb-20">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-[#5BAD46] hover:text-[#7BCEC0] mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {tCommon("backToApp")}
        </Link>
        <article className="prose prose-lg max-w-none">
          <MDXRemote source={source} />
        </article>
      </main>
    </div>
  );
}
