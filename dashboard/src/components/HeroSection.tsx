"use client";

import { Report, Lang } from "@/lib/types";
import { t, tMetric } from "@/lib/i18n";

interface KpiData {
  metric: string;
  metricKo: string;
  min: number;
  max: number;
  avg: number;
  count: number;
  allSignificant: boolean;
}

function computeKpis(data: Report[], lang: Lang): KpiData[] {
  const map: Record<string, { values: number[]; reports: Set<string>; pSig: boolean[] }> = {};

  for (const report of data) {
    if (report.type !== "efficacy") continue;
    for (const m of report.metrics) {
      const comp = m.comparative_improvement ?? [];
      if (!comp.length) continue;

      if (!map[m.metric]) {
        map[m.metric] = { values: [], reports: new Set(), pSig: [] };
      }
      for (const v of comp) {
        map[m.metric].values.push(v);
        map[m.metric].reports.add(report.report_code);
      }
      for (const p of m.between_group_p ?? []) {
        const isSig = String(p).includes("<") || (typeof p === "number" && p < 0.05);
        map[m.metric].pSig.push(isSig);
      }
    }
  }

  return Object.entries(map)
    .filter(([, d]) => d.values.length > 0)
    .map(([metric, d]) => ({
      metric: tMetric(metric, lang),
      metricKo: metric,
      min: Math.min(...d.values),
      max: Math.max(...d.values),
      avg: d.values.reduce((a, b) => a + b, 0) / d.values.length,
      count: d.reports.size,
      allSignificant: d.pSig.length > 0 && d.pSig.every(Boolean),
    }))
    .sort((a, b) => b.avg - a.avg);
}

const HERO_METRICS = ["탄력", "주름(눈가)", "보습"];

export default function HeroSection({ data, lang }: { data: Report[]; lang: Lang }) {
  const kpis = computeKpis(data, lang);
  const heroItems = HERO_METRICS.map((m) => kpis.find((k) => k.metricKo === m)).filter(Boolean) as KpiData[];
  const subItems = kpis.filter((k) => !HERO_METRICS.includes(k.metricKo));

  const [main1, main2, main3] = heroItems;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">

      {/* ── 헤더 카드 ── */}
      <div className="col-span-2 sm:col-span-4 bento-card-dark rounded-[20px] px-7 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
            {t("hero_title", lang)}
          </h1>
          <p className="text-white/40 text-xs mt-1">{t("hero_subtitle", lang)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[#FF6B6B] text-xs font-bold px-3 py-1 rounded-full border border-[#FF6B6B]/30 bg-[#FF6B6B]/10">
            18 Clinical Trials
          </span>
          <span className="hidden sm:inline-block text-white/30 text-xs font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5">
            Mimetics R&amp;D
          </span>
        </div>
      </div>

      {/* ── 메인 KPI 1: 탄력 (2×2 feature card) ── */}
      {main1 && (
        <div className="col-span-2 sm:col-span-2 sm:row-span-2 bento-card-accent rounded-[20px] p-6 sm:p-8 flex flex-col justify-between min-h-[160px] sm:min-h-[220px]">
          <div>
            <span className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              {main1.metric}
            </span>
            <div className="text-5xl sm:text-7xl font-black text-white mt-2 sm:mt-4 leading-none">
              +{main1.max.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-white/80 text-xs sm:text-sm font-semibold">
              {lang === "ko" ? "대조군 대비 최대 개선율" : lang === "ja" ? "対照群比最大改善率" : "Max improvement vs. Control"}
            </div>
            <div className="text-white/50 text-[11px] mt-0.5">
              {t("kpi_products", lang, { count: main1.count, avg: main1.avg.toFixed(0) })}
            </div>
          </div>
        </div>
      )}

      {/* ── 메인 KPI 2: 주름 ── */}
      {main2 && (
        <div className="col-span-1 bento-card-navy rounded-[20px] p-4 sm:p-6 flex flex-col justify-between min-h-[120px]">
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{main2.metric}</span>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-white leading-none mt-2">
              +{main2.max.toFixed(0)}%
            </div>
            <div className="text-white/35 text-[10px] mt-1">
              {t("kpi_products", lang, { count: main2.count, avg: main2.avg.toFixed(0) })}
            </div>
          </div>
        </div>
      )}

      {/* ── 메인 KPI 3: 보습 ── */}
      {main3 && (
        <div className="col-span-1 rounded-[20px] p-4 sm:p-6 flex flex-col justify-between min-h-[120px]"
          style={{ background: "#16213e" }}>
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{main3.metric}</span>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-white leading-none mt-2">
              +{main3.max.toFixed(0)}%
            </div>
            <div className="text-white/35 text-[10px] mt-1">
              {t("kpi_products", lang, { count: main3.count, avg: main3.avg.toFixed(0) })}
            </div>
          </div>
        </div>
      )}

      {/* ── 서브 KPI 카드들 ── */}
      {subItems.map((kpi) => {
        const rangeStr =
          kpi.min === kpi.max
            ? `+${kpi.min.toFixed(0)}%`
            : `+${kpi.min.toFixed(0)}~${kpi.max.toFixed(0)}%`;
        return (
          <div
            key={kpi.metricKo}
            className="col-span-1 bento-card rounded-[16px] p-4 flex flex-col justify-between min-h-[90px]"
          >
            <span className="text-[11px] text-gray-500 font-semibold">{kpi.metric}</span>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#FF6B6B] leading-tight">{rangeStr}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {t("kpi_products", lang, { count: kpi.count, avg: kpi.avg.toFixed(0) })}
              </div>
              {kpi.allSignificant && (
                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1">
                  p&lt;0.05
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* ── 범위 안내 ── */}
      <div className="col-span-2 sm:col-span-4 rounded-[14px] px-4 py-2.5 bg-white/60 border border-black/5">
        <p className="text-[11px] text-gray-400 text-center">{t("kpi_range_note", lang)}</p>
      </div>
    </div>
  );
}
