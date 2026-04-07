"use client";

import { useState } from "react";
import { Report, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import HeroSection from "./HeroSection";
import EfficacySection from "./EfficacySection";
import AbsorptionSection from "./AbsorptionSection";
import SafetySection from "./SafetySection";
import DataSourcesSection from "./DataSourcesSection";

const LANG_OPTIONS: { label: string; value: Lang }[] = [
  { label: "한국어", value: "ko" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

const NAV_ITEMS: { id: string; labelKey: string }[] = [
  { id: "sec-efficacy", labelKey: "tab_efficacy" },
  { id: "sec-heatmap", labelKey: "sec3_title" },
  { id: "sec-absorption", labelKey: "tab_absorption" },
  { id: "sec-safety", labelKey: "tab_safety" },
  { id: "sec-sources", labelKey: "tab_sources" },
];

export default function Dashboard({ data }: { data: Report[] }) {
  const [lang, setLang] = useState<Lang>("ko");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Language selector */}
      <div className="flex justify-end mb-2">
        <select
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
        >
          {LANG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Hero + KPIs */}
      <HeroSection data={data} lang={lang} />

      {/* Navigation bar */}
      <div className="flex gap-2 justify-center flex-wrap py-3 mb-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-colors"
          >
            {t(item.labelKey, lang)}
          </button>
        ))}
      </div>

      {/* Sections */}
      <EfficacySection data={data} lang={lang} />
      <AbsorptionSection data={data} lang={lang} />
      <SafetySection data={data} lang={lang} />
      <DataSourcesSection data={data} lang={lang} />
    </div>
  );
}
