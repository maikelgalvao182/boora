"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CommunityGuidelinesContent from "../content/community-guidelines.mdx";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#92DFD2] hover:text-[#7BCEC0] mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <article className="prose prose-sm max-w-none">
            <CommunityGuidelinesContent />
          </article>
        </div>
      </main>
    </div>
  );
}
