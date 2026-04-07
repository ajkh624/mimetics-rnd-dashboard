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

  return (
    <>
      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-8 py-10 text-center mb-2">
        <h1 className="text-3xl font-black text-white mb-1">{t("hero_title", lang)}</h1>
        <p className="text-white/50 text-sm">{t("hero_subtitle", lang)}</p>
      </div>

      {/* Hero 3 KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {heroItems.map((kpi) => (
          <div key={kpi.metricKo} className="bg-[#1a1a2e] rounded-2xl p-6 text-center">
            <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1">
              {kpi.metric}
            </div>
            <div className="text-4xl font-black text-[#FF6B6B] leading-tight">
              +{kpi.max.toFixed(0)}%
            </div>
            <div className="text-[11px] text-white/30 mt-1">
              {t("kpi_products", lang, { count: kpi.count, avg: kpi.avg.toFixed(0) })}
            </div>
          </div>
        ))}
      </div>

      {/* Sub KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {subItems.map((kpi) => {
          const rangeStr = kpi.min === kpi.max
            ? `+${kpi.min.toFixed(0)}%`
            : `+${kpi.min.toFixed(0)}~${kpi.max.toFixed(0)}%`;
          return (
            <div key={kpi.metricKo} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 font-semibold mb-1">{kpi.metric}</div>
              <div className="text-xl font-extrabold text-red-500">{rangeStr}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {t("kpi_products", lang, { count: kpi.count, avg: kpi.avg.toFixed(0) })}
              </div>
              {kpi.allSignificant && (
                <span className="inline-block bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                  p&lt;0.05
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
