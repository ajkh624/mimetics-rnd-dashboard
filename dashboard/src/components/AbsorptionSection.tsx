"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Report, Lang } from "@/lib/types";
import { t, tMetric, tProduct, tBodyPart } from "@/lib/i18n";

const COLOR_TEST = "#e74c3c";
const COLOR_CONTROL = "#2ecc71";

interface AbsRow {
  label: string;
  metric: string;
  test: number | null;
  ctrl: number | null;
  comp: number | null;
}

function getAbsorptionData(data: Report[], lang: Lang): AbsRow[] {
  const rows: AbsRow[] = [];
  for (const r of data) {
    if (r.type !== "absorption") continue;
    const pilot = r.subjects <= 5 ? ` ${t("pilot_label", lang)}` : "";
    for (const m of r.metrics) {
      const test = m.test_improvement?.[0] ?? null;
      const ctrl = m.control_improvement?.[0] ?? null;
      const comp = m.comparative_improvement?.[0] ?? null;
      rows.push({
        label: `[${r.report_code}] ${tProduct(r.product, lang)} (${tBodyPart(r.body_part ?? "", lang)}, n=${r.subjects})${pilot}`,
        metric: tMetric(m.metric, lang),
        test, ctrl, comp,
      });
    }
  }
  return rows;
}

export default function AbsorptionSection({ data, lang }: { data: Report[]; lang: Lang }) {
  const rows = getAbsorptionData(data, lang);
  const metrics = [...new Set(rows.map((r) => r.metric))].sort();
  const [activeMetric, setActiveMetric] = useState(metrics[0] ?? "");

  const filtered = rows.filter((r) => r.metric === activeMetric).sort((a, b) => (a.comp ?? 0) - (b.comp ?? 0));

  return (
    <div id="sec-absorption">
      <h2 className="section-title">{t("sec4_title", lang)}</h2>

      {/* Metric tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {metrics.map((m) => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeMetric === m
                ? "bg-[#FF6B6B] text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={Math.max(250, filtered.length * 70 + 80)}>
        <BarChart data={filtered} layout="vertical" margin={{ left: 320, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: t("axis_improvement", lang), position: "bottom" }} />
          <YAxis dataKey="label" type="category" width={310} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v) => `${Number(v).toFixed(0)}%`} />
          <Legend />
          <Bar dataKey="ctrl" fill={COLOR_CONTROL} name={t("legend_control", lang)} />
          <Bar dataKey="test" fill={COLOR_TEST} name={t("legend_test", lang)} />
        </BarChart>
      </ResponsiveContainer>

      {/* Data table */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          {lang === "ko" ? "흡수도 상세 데이터 테이블" : "Detailed Data Table"}
        </summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left">{t("col_report", lang)}</th>
                <th className="p-2 border text-left">{t("col_metric", lang)}</th>
                <th className="p-2 border text-right">{t("col_test", lang)}</th>
                <th className="p-2 border text-right">{t("col_ctrl", lang)}</th>
                <th className="p-2 border text-right">{t("col_comp", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.label}</td>
                  <td className="p-2 border">{r.metric}</td>
                  <td className="p-2 border text-right">{r.test?.toFixed(0) ?? "-"}%</td>
                  <td className="p-2 border text-right">{r.ctrl?.toFixed(0) ?? "-"}%</td>
                  <td className="p-2 border text-right font-semibold">{r.comp?.toFixed(0) ?? "-"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
