"use client";

import { useState } from "react";
import { Report, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import HeroSection from "./HeroSection";
import EfficacySection from "./EfficacySection";
import AbsorptionSection from "./AbsorptionSection";
import SafetySection from "./SafetySection";
import DataSourcesSection from "./DataSourcesSection";
import Sidebar from "./Sidebar";
import InsightBox from "./InsightBox";
import AdvisorSection from "./AdvisorSection";

const LANG_OPTIONS: { label: string; value: Lang }[] = [
  { label: "한국어", value: "ko" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

const NAV_ITEMS: { id: string; labelKey: string; icon: string }[] = [
  { id: "sec-efficacy", labelKey: "tab_efficacy", icon: "📊" },
  { id: "sec-heatmap", labelKey: "nav_heatmap", icon: "🗺️" },
  { id: "sec-absorption", labelKey: "tab_absorption", icon: "💧" },
  { id: "sec-safety", labelKey: "tab_safety", icon: "🛡️" },
  { id: "sec-sources", labelKey: "tab_sources", icon: "📋" },
  { id: "sec-advisor", labelKey: "tab_advisor", icon: "🤖" },
];

export default function Dashboard({ data }: { data: Report[] }) {
  const [lang, setLang] = useState<Lang>("ko");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
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

      {/* Hero + KPIs (full width) */}
      <HeroSection data={data} lang={lang} />
      <InsightBox text={t("insight_kpi", lang)} />

      {/* Sticky Navigation bar */}
      <div className="sticky top-0 z-50 bg-[#f5f6f8]/95 backdrop-blur-sm py-3 -mx-4 px-4 mb-6 border-b border-gray-200">
        <div className="flex gap-2 justify-center flex-wrap">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all shadow-sm hover:shadow"
            >
              <span className="mr-1">{item.icon}</span>
              {t(item.labelKey, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar + Main content */}
      <div className="flex gap-6">
        <Sidebar lang={lang} />

        <main className="flex-1 min-w-0">
          <EfficacySection data={data} lang={lang} />
          <InsightBox text={t("insight_efficacy", lang)} />

          <div className="mt-2">
            <InsightBox text={t("insight_heatmap", lang)} />
          </div>

          <div className="my-8" />
          <AbsorptionSection data={data} lang={lang} />
          <InsightBox text={t("insight_absorption", lang)} />

          <div className="my-8" />
          <SafetySection data={data} lang={lang} />
          <InsightBox text={t("insight_safety", lang)} />

          <div className="my-8" />
          <DataSourcesSection data={data} lang={lang} />

          <div className="my-8" />
          <AdvisorSection lang={lang} />
        </main>
      </div>

      {/* Footer */}
      <div className="mt-12 py-6 border-t border-gray-200 text-center text-xs text-gray-400">
        &copy; 2025 Mimetics Inc. | {lang === "ko" ? "18개 임상시험 보고서 기반 자동 파싱 데이터" : "Auto-parsed from 18 clinical trial reports"}
      </div>
    </div>
  );
}
