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
    <div className="max-w-[1400px] mx-auto px-4 py-5">
      {/* Language selector */}
      <div className="flex justify-end mb-3">
        <select
          className="border border-black/10 rounded-xl px-3 py-1.5 text-sm bg-white/80 backdrop-blur-sm shadow-sm font-medium text-gray-700"
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
      <div className="sticky top-0 z-50 backdrop-blur-md py-2.5 -mx-4 px-4 mb-6 border-b border-black/8" style={{ background: "rgba(220,220,220,0.92)" }}>
        <div className="flex gap-2 justify-center flex-wrap">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white/80 border border-black/8 hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all shadow-sm hover:shadow"
            >
              <span className="mr-1">{item.icon}</span>
              {t(item.labelKey, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar + Main content */}
      <div className="flex gap-5">
        <Sidebar lang={lang} />

        <main className="flex-1 min-w-0">
          <EfficacySection data={data} lang={lang} />
          <InsightBox text={t("insight_efficacy", lang)} />

          <div className="mt-2">
            <InsightBox text={t("insight_heatmap", lang)} />
          </div>

          <div className="my-7" />
          <AbsorptionSection data={data} lang={lang} />
          <InsightBox text={t("insight_absorption", lang)} />

          <div className="my-7" />
          <SafetySection data={data} lang={lang} />
          <InsightBox text={t("insight_safety", lang)} />

          <div className="my-7" />
          <DataSourcesSection data={data} lang={lang} />

          <div className="my-7" />
          <AdvisorSection lang={lang} />
        </main>
      </div>

      {/* Footer */}
      <div className="mt-12 py-5 text-center text-xs text-gray-400">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/50 border border-black/6">
          <span className="font-semibold text-gray-500">© 2025 Mimetics Inc.</span>
          <span className="text-gray-300">·</span>
          <span>{lang === "ko" ? "18개 임상시험 보고서 기반 자동 파싱 데이터" : "Auto-parsed from 18 clinical trial reports"}</span>
        </div>
      </div>
    </div>
  );
}
