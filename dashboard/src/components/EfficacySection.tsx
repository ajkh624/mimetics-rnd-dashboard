"use client";

import { useState } from "react";
import {} from "recharts";
import { Report, Lang } from "@/lib/types";
import { t, tMetric, tProduct } from "@/lib/i18n";

const COLOR_TEST = "#e74c3c";
const COLOR_CONTROL = "#2ecc71";

function getAllMetrics(data: Report[]): string[] {
  const set = new Set<string>();
  for (const r of data) {
    if (r.type !== "efficacy") continue;
    for (const m of r.metrics) set.add(m.metric);
  }
  return Array.from(set).sort();
}

interface BarRow {
  name: string;
  test: number;
  ctrl: number;
  comp: number;
}

function getMetricBars(data: Report[], metricName: string, lang: Lang): BarRow[] {
  const rows: BarRow[] = [];
  for (const r of data) {
    if (r.type !== "efficacy") continue;
    for (const m of r.metrics) {
      if (m.metric !== metricName) continue;
      const test = m.test_improvement?.slice(-1)[0] ?? 0;
      const ctrl = m.control_improvement?.slice(-1)[0] ?? 0;
      const comp = m.comparative_improvement?.slice(-1)[0] ?? 0;
      rows.push({
        name: `[${r.report_code}] ${tProduct(r.product, lang)}`,
        test, ctrl, comp,
      });
    }
  }
  return rows.sort((a, b) => a.comp - b.comp);
}

function getOverviewData(data: Report[], lang: Lang) {
  const map: Record<string, number[]> = {};
  for (const r of data) {
    if (r.type !== "efficacy") continue;
    for (const m of r.metrics) {
      const comp = m.comparative_improvement ?? [];
      if (!comp.length) continue;
      const key = m.metric;
      if (!map[key]) map[key] = [];
      map[key].push(...comp);
    }
  }
  return Object.entries(map)
    .map(([metric, vals]) => ({
      metric: tMetric(metric, lang),
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
      count: vals.length,
    }))
    .sort((a, b) => a.avg - b.avg);
}

// Heatmap
function getHeatmapData(data: Report[], lang: Lang) {
  const rows: { product: string; metric: string; value: number | null }[] = [];
  const productSet = new Set<string>();
  const metricOrder = [
    "보습", "탄력", "주름(눈가)", "주름(팔자)", "주름",
    "피부결", "피부밀도", "모공", "리프팅", "다크서클", "색소", "피부 광",
  ];

  for (const r of data) {
    if (r.type !== "efficacy") continue;
    const product = `[${r.report_code}] ${tProduct(r.product, lang)}`;
    productSet.add(product);
    for (const m of r.metrics) {
      const comp = m.comparative_improvement ?? [];
      if (!comp.length) continue;
      rows.push({ product, metric: m.metric, value: comp.slice(-1)[0] });
    }
  }

  const products = Array.from(productSet);
  const metricsUsed = metricOrder.filter((m) => rows.some((r) => r.metric === m));

  const grid = products.map((p) => {
    const row: Record<string, number | string | null> = { product: p };
    for (const m of metricsUsed) {
      const cell = rows.find((r) => r.product === p && r.metric === m);
      row[tMetric(m, lang)] = cell?.value ?? null;
    }
    return row;
  });

  return { grid, metrics: metricsUsed.map((m) => tMetric(m, lang)) };
}

function getColor(value: number | null): string {
  if (value === null) return "#f5f5f5";
  const clamped = Math.min(Math.max(value, 0), 300);
  const ratio = clamped / 300;
  if (ratio < 0.3) return `rgb(255, ${243 - Math.round(ratio * 200)}, ${224 - Math.round(ratio * 200)})`;
  if (ratio < 0.6) return `rgb(255, ${183 - Math.round((ratio - 0.3) * 300)}, ${77 - Math.round((ratio - 0.3) * 80)})`;
  return `rgb(${211 + Math.round((1 - ratio) * 44)}, ${47 - Math.round((ratio - 0.6) * 60)}, ${47 - Math.round((ratio - 0.6) * 60)})`;
}

/* Custom overview chart: horizontal bars showing min→max range with avg diamond */
function OverviewChart({ data, lang }: { data: Report[]; lang: Lang }) {
  const items = getOverviewData(data, lang);
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const maxScale = Math.max(...items.map((i) => i.max), 300);
        const minPct = (item.min / maxScale) * 100;
        const maxPct = (item.max / maxScale) * 100;
        const avgPct = (item.avg / maxScale) * 100;
        return (
          <div key={item.metric} className="flex items-center gap-3">
            <div className="w-24 text-right text-sm font-semibold text-gray-700 shrink-0">
              {item.metric}
            </div>
            <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
              {/* Range bar */}
              <div
                className="absolute top-1 bottom-1 rounded"
                style={{
                  left: `${minPct}%`,
                  width: `${maxPct - minPct}%`,
                  background: "linear-gradient(90deg, #FFB74D, #FF7043, #e74c3c)",
                  opacity: 0.7,
                }}
              />
              {/* Average marker */}
              <div
                className="absolute top-0 bottom-0 flex items-center"
                style={{ left: `${avgPct}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-3 h-3 bg-[#e74c3c] rotate-45 border-2 border-white shadow" />
              </div>
              {/* Labels */}
              <div
                className="absolute top-0 h-full flex items-center text-[11px] font-bold text-gray-800"
                style={{ left: `${minPct}%`, transform: "translateX(-100%) translateX(-6px)" }}
              >
                {item.min.toFixed(0)}%
              </div>
              <div
                className="absolute top-0 h-full flex items-center text-[11px] font-bold text-gray-800"
                style={{ left: `${maxPct}%`, transform: "translateX(6px)" }}
              >
                {item.max.toFixed(0)}%
              </div>
            </div>
            <div className="w-20 text-xs text-gray-500 shrink-0">
              {lang === "ko" ? "평균" : "avg"} <span className="font-bold text-[#e74c3c]">+{item.avg}%</span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 justify-center">
        <div className="w-3 h-3 bg-[#e74c3c] rotate-45" /> = {lang === "ko" ? "평균" : "Average"}
        <span className="mx-2">|</span>
        <div className="w-8 h-2 rounded" style={{ background: "linear-gradient(90deg, #FFB74D, #e74c3c)" }} /> = {lang === "ko" ? "범위(min~max)" : "Range"}
      </div>
    </div>
  );
}

/* Metric detail: bar chart + comparative improvement badges */
function MetricDetailView({ data, metricName, lang }: { data: Report[]; metricName: string; lang: Lang }) {
  const rows = getMetricBars(data, metricName, lang);
  const compLabel = lang === "ko" ? "대조군 대비" : lang === "ja" ? "対照群比" : "vs Control";

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.name} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 max-w-[60%] truncate">{row.name}</span>
              <span className="bg-[#FF6B6B] text-white text-xs font-bold px-3 py-1 rounded-full">
                {compLabel} +{row.comp.toFixed(0)}%
              </span>
            </div>
            <div className="space-y-1.5">
              {/* Control bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-24 text-right shrink-0">{t("legend_control", lang)}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.min((row.ctrl / Math.max(row.test, row.ctrl, 1)) * 100, 100)}%`,
                      background: COLOR_CONTROL,
                      minWidth: "30px",
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">{row.ctrl.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              {/* Test bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-24 text-right shrink-0">{t("legend_test", lang)}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.min((row.test / Math.max(row.test, row.ctrl, 1)) * 100, 100)}%`,
                      background: COLOR_TEST,
                      minWidth: "30px",
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">{row.test.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4 text-xs text-gray-400 justify-center">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_CONTROL }} /> {t("legend_control", lang)}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_TEST }} /> {t("legend_test", lang)}</span>
      </div>
    </div>
  );
}

export default function EfficacySection({ data, lang }: { data: Report[]; lang: Lang }) {
  const allMetrics = getAllMetrics(data);
  const [selectedMetric, setSelectedMetric] = useState<string>("__all__");
  const heatmap = getHeatmapData(data, lang);

  return (
    <div id="sec-efficacy">
      <h2 className="section-title">{t("sec2_title", lang)}</h2>

      {/* Metric selector — pill buttons */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setSelectedMetric("__all__")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            selectedMetric === "__all__"
              ? "bg-[#1a1a2e] text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t("filter_all", lang)}
        </button>
        {allMetrics.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMetric(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedMetric === m
                ? "bg-[#FF6B6B] text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tMetric(m, lang)}
          </button>
        ))}
      </div>

      {/* Chart */}
      {selectedMetric === "__all__" ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <OverviewChart data={data} lang={lang} />
        </div>
      ) : (
        <MetricDetailView data={data} metricName={selectedMetric} lang={lang} />
      )}

      {/* Heatmap */}
      <h2 className="section-title mt-10" id="sec-heatmap">{t("sec3_title", lang)}</h2>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-50 border border-gray-200 min-w-[220px] text-xs font-bold text-gray-700">
                {t("col_product", lang)}
              </th>
              {heatmap.metrics.map((m) => (
                <th key={m} className="p-3 text-center bg-gray-50 border border-gray-200 min-w-[75px] text-xs font-bold text-gray-700">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.grid.map((row) => (
              <tr key={row.product as string}>
                <td className="p-3 border border-gray-200 text-xs font-medium text-gray-800">
                  {row.product as string}
                </td>
                {heatmap.metrics.map((m) => {
                  const val = row[m] as number | null;
                  return (
                    <td
                      key={m}
                      className="p-3 border border-gray-200 text-center text-sm font-bold"
                      style={{ backgroundColor: getColor(val), color: val !== null && val > 150 ? "#fff" : "#333" }}
                    >
                      {val !== null ? `${val.toFixed(0)}%` : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Color scale legend */}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 justify-end">
          <span>0%</span>
          <div className="flex h-3 w-40 rounded overflow-hidden">
            <div className="flex-1" style={{ background: "#FFF3E0" }} />
            <div className="flex-1" style={{ background: "#FFB74D" }} />
            <div className="flex-1" style={{ background: "#FF7043" }} />
            <div className="flex-1" style={{ background: "#D32F2F" }} />
          </div>
          <span>300%+</span>
        </div>
      </div>
    </div>
  );
}
