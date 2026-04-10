"use client";

import { useState } from "react";
import { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

const STEPS = ["guide_step1", "guide_step2", "guide_step3", "guide_step4", "guide_step5", "guide_step6"] as const;
const TERMS = ["guide_term_test", "guide_term_control", "guide_term_comp", "guide_term_pvalue"] as const;

function GuideContent({ lang }: { lang: Lang }) {
  return (
    <>
      <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-3 flex items-center gap-1.5">
        <span className="text-base">📖</span>
        {t("guide_title", lang)}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        {t("guide_overview", lang)}
      </p>

      <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
        <span>🔍</span> {t("guide_how_title", lang)}
      </h4>
      <ol className="space-y-2 mb-4">
        {STEPS.map((key, i) => (
          <li key={key} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
            <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF6B6B] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span>{t(key, lang)}</span>
          </li>
        ))}
      </ol>

      <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
        <span>📝</span> {t("guide_terms_title", lang)}
      </h4>
      <ul className="space-y-1.5">
        {TERMS.map((key) => (
          <li key={key} className="text-[11px] text-gray-500 leading-relaxed pl-3 border-l-2 border-gray-200">
            {t(key, lang)}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Sidebar({ lang }: { lang: Lang }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-72 shrink-0 hidden lg:block">
        <div className="sticky top-16 space-y-5">
          <a
            href="https://drive.google.com/drive/u/0/folders/1mQpygZQQZyet2IElyXpFqPrgpt9IMF5V"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📂</span>
              <div>
                <div className="text-sm font-bold text-blue-700 group-hover:text-blue-900">
                  {lang === "ko" ? "임상결과 원본 보기" : lang === "ja" ? "臨床結果の原本を見る" : "View Original Reports"}
                </div>
                <div className="text-[11px] text-blue-500">Google Drive ↗</div>
              </div>
            </div>
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/1QxXFnTcUTT4Sjy1VURLxWQETSDJau82_7EGzDhgIzSs/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-4 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-sm font-bold text-green-700 group-hover:text-green-900">
                  {lang === "ko" ? "임상시험 관리 시트" : lang === "ja" ? "臨床試験管理シート" : "Trial Management Sheet"}
                </div>
                <div className="text-[11px] text-green-500">Google Sheets ↗</div>
              </div>
            </div>
          </a>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <GuideContent lang={lang} />
          </div>
        </div>
      </aside>

      {/* Mobile floating button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-50 w-12 h-12 rounded-full bg-[#1a1a2e] text-white shadow-lg flex items-center justify-center text-lg hover:bg-[#FF6B6B] transition-colors"
        aria-label={t("guide_title", lang)}
      >
        📖
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-sm font-bold text-[#1a1a2e]">📖 {t("guide_title", lang)}</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <GuideContent lang={lang} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
