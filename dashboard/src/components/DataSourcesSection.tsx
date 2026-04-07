"use client";

import { Report, Lang } from "@/lib/types";
import { t, tMetric, tProduct } from "@/lib/i18n";

export default function DataSourcesSection({ data, lang }: { data: Report[]; lang: Lang }) {
  const typeMap: Record<string, string> = {
    efficacy: t("type_efficacy", lang),
    absorption: t("type_absorption", lang),
    safety: t("type_safety", lang),
  };

  return (
    <div id="sec-sources">
      <details>
        <summary className="section-title cursor-pointer">{t("sec6_title", lang)}</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left">{t("col_report", lang)}</th>
                <th className="p-2 border text-left">{t("col_type", lang)}</th>
                <th className="p-2 border text-left">{t("col_product", lang)}</th>
                <th className="p-2 border text-left">{lang === "ko" ? "보고서 제목" : "Title"}</th>
                <th className="p-2 border text-left">{t("col_duration", lang)}</th>
                <th className="p-2 border text-right">{t("col_subjects", lang)}</th>
                <th className="p-2 border text-left">{lang === "ko" ? "추출 지표" : "Metrics"}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => {
                const metricNames = r.type === "safety"
                  ? [`${t("col_irritation", lang)} ${r.safety_data?.irritation_index ?? ""}`]
                  : r.metrics.map((m) => tMetric(m.metric, lang));
                return (
                  <tr key={r.report_code} className="hover:bg-gray-50">
                    <td className="p-2 border font-mono">{r.report_code}</td>
                    <td className="p-2 border">{typeMap[r.type] ?? r.type}</td>
                    <td className="p-2 border">{tProduct(r.product, lang)}</td>
                    <td className="p-2 border">{r.title}</td>
                    <td className="p-2 border">{r.duration ?? "-"}</td>
                    <td className="p-2 border text-right">{r.subjects ?? "-"}</td>
                    <td className="p-2 border">{metricNames.join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
