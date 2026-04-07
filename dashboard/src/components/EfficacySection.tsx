"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis,
} from "recharts";
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
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      range: Math.max(...vals) - Math.min(...vals),
    }))
    .sort((a, b) => a.avg - b.avg);
}

// Heatmap data
interface HeatmapCell {
  product: string;
  metric: string;
  value: number | null;
}

function getHeatmapData(data: Report[], lang: Lang) {
  const rows: HeatmapCell[] = [];
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
  const metricsUsed = metricOrder.filter((m) =>
    rows.some((r) => r.metric === m)
  );

  // Build grid
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

export default function EfficacySection({ data, lang }: { data: Report[]; lang: Lang }) {
  const allMetrics = getAllMetrics(data);
  const [selectedMetric, setSelectedMetric] = useState<string>("__all__");
  const heatmap = getHeatmapData(data, lang);

  return (
    <div id="sec-efficacy">
      <h2 className="section-title">{t("sec2_title", lang)}</h2>

      {/* Metric selector */}
      <div className="mb-4">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="__all__">{t("filter_all", lang)}</option>
          {allMetrics.map((m) => (
            <option key={m} value={m}>{tMetric(m, lang)}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {selectedMetric === "__all__" ? (
        <ResponsiveContainer width="100%" height={Math.max(350, getOverviewData(data, lang).length * 40 + 80)}>
          <BarChart data={getOverviewData(data, lang)} layout="vertical" margin={{ left: 120, right: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: t("axis_improvement", lang), position: "bottom" }} />
            <YAxis dataKey="metric" type="category" width={110} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="range" stackId="a" fill="rgba(231,76,60,0.25)" name={`${lang === "ko" ? "범위" : "Range"}`} />
            <Bar dataKey="min" stackId="a" fill="transparent" name="" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(300, getMetricBars(data, selectedMetric, lang).length * 60 + 80)}>
          <BarChart data={getMetricBars(data, selectedMetric, lang)} layout="vertical" margin={{ left: 240, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: t("axis_improvement", lang), position: "bottom" }} />
            <YAxis dataKey="name" type="category" width={230} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="ctrl" fill={COLOR_CONTROL} name={t("legend_control", lang)} />
            <Bar dataKey="test" fill={COLOR_TEST} name={t("legend_test", lang)} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Heatmap */}
      <h2 className="section-title mt-8" id="sec-heatmap">{t("sec3_title", lang)}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left bg-gray-50 border border-gray-200 min-w-[200px]">
                {t("col_product", lang)}
              </th>
              {heatmap.metrics.map((m) => (
                <th key={m} className="p-2 text-center bg-gray-50 border border-gray-200 min-w-[80px] text-xs">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.grid.map((row) => (
              <tr key={row.product as string}>
                <td className="p-2 border border-gray-200 text-xs font-medium">
                  {row.product as string}
                </td>
                {heatmap.metrics.map((m) => {
                  const val = row[m] as number | null;
                  return (
                    <td
                      key={m}
                      className="p-2 border border-gray-200 text-center text-xs font-semibold"
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
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>0%</span>
        <div className="flex h-3 w-48 rounded overflow-hidden">
          <div className="flex-1" style={{ background: "#FFF3E0" }} />
          <div className="flex-1" style={{ background: "#FFB74D" }} />
          <div className="flex-1" style={{ background: "#FF7043" }} />
          <div className="flex-1" style={{ background: "#D32F2F" }} />
        </div>
        <span>300%+</span>
      </div>
    </div>
  );
}
