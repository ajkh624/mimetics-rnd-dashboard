"use client";

import { useState } from "react";
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
  const labelCount: Record<string, number> = {};

  for (const r of data) {
    if (r.type !== "absorption") continue;
    const pilot = r.subjects <= 5 ? ` ${t("pilot_label", lang)}` : "";
    for (const m of r.metrics) {
      const test = m.test_improvement?.[0] ?? null;
      const ctrl = m.control_improvement?.[0] ?? null;
      const comp = m.comparative_improvement?.[0] ?? null;
      const baseLabel = `[${r.report_code}] ${tProduct(r.product, lang)} (${tBodyPart(r.body_part ?? "", lang)}, n=${r.subjects})${pilot}`;
      const metricKey = tMetric(m.metric, lang);
      const dedupeKey = `${baseLabel}__${metricKey}`;

      // 중복 라벨 구분 (패치A/B)
      labelCount[dedupeKey] = (labelCount[dedupeKey] ?? 0) + 1;
      const suffix = labelCount[dedupeKey] > 1 ? ` [${lang === "ko" ? "조건" : "Cond"} ${labelCount[dedupeKey]}]` : "";

      rows.push({
        label: baseLabel + suffix,
        metric: metricKey,
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
  const compLabel = lang === "ko" ? "대조군 대비" : lang === "ja" ? "対照群比" : "vs Control";

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

      {/* Absorption detail cards */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {filtered.map((row, i) => {
            const maxVal = Math.max(row.test ?? 0, row.ctrl ?? 0, 1);
            return (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700 max-w-[55%]">{row.label}</span>
                  {row.comp != null && (
                    <span className="bg-[#FF6B6B] text-white text-xs font-bold px-3 py-1 rounded-full shrink-0">
                      {compLabel} +{row.comp.toFixed(0)}%
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-24 text-right shrink-0">{t("legend_control", lang)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(((row.ctrl ?? 0) / maxVal) * 100, 100)}%`,
                          background: COLOR_CONTROL,
                          minWidth: row.ctrl ? "40px" : "0",
                        }}
                      >
                        {row.ctrl != null && <span className="text-[10px] font-bold text-white">{row.ctrl.toFixed(0)}%</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-24 text-right shrink-0">{t("legend_test", lang)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(((row.test ?? 0) / maxVal) * 100, 100)}%`,
                          background: COLOR_TEST,
                          minWidth: row.test ? "40px" : "0",
                        }}
                      >
                        {row.test != null && <span className="text-[10px] font-bold text-white">{row.test.toFixed(0)}%</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400 justify-center">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_CONTROL }} /> {t("legend_control", lang)}</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_TEST }} /> {t("legend_test", lang)}</span>
        </div>
      </div>

      {/* Data table */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          {lang === "ko" ? "흡수도 상세 데이터 테이블" : "Detailed Data Table"}
        </summary>
        <div className="overflow-x-auto mt-2 bg-white rounded-xl p-3 border border-gray-100">
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
