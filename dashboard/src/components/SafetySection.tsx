"use client";

import { Report, Lang } from "@/lib/types";
import { t, tProduct, tSafety } from "@/lib/i18n";

export default function SafetySection({ data, lang }: { data: Report[]; lang: Lang }) {
  const safetyReports = data.filter((r) => r.type === "safety");
  const indices = safetyReports
    .map((r) => r.safety_data?.irritation_index)
    .filter((v): v is number => v != null)
    .sort();
  const idxStr = indices.length ? indices.map(String).join("~") : "-";

  const cards = [
    { label: t("safety_adverse", lang), value: t("safety_adverse_val", lang), detail: t("safety_adverse_detail", lang) },
    { label: t("safety_irritation", lang), value: idxStr, detail: t("safety_irritation_detail", lang) },
    { label: t("safety_compliance", lang), value: "99.3~100%", detail: t("safety_compliance_detail", lang) },
    { label: t("safety_satisfaction", lang), value: "85~100%", detail: t("safety_satisfaction_detail", lang) },
  ];

  return (
    <div id="sec-safety">
      <h2 className="section-title">{t("sec5_title", lang)}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`rounded-[18px] p-5 text-center ${
              i === 0
                ? "bento-card-dark text-white"
                : "bento-card border border-green-100"
            }`}
          >
            <div className={`text-xs font-semibold mb-2 ${i === 0 ? "text-white/60" : "text-gray-500"}`}>
              {card.label}
            </div>
            <div className={`text-2xl font-extrabold ${i === 0 ? "text-green-400" : "text-green-600"}`}>
              {card.value}
            </div>
            <div className={`text-[11px] mt-1 ${i === 0 ? "text-white/40" : "text-gray-500"}`}>
              {card.detail}
            </div>
          </div>
        ))}
      </div>

      {safetyReports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left">{t("col_report", lang)}</th>
                <th className="p-2 border text-left">{t("col_product", lang)}</th>
                <th className="p-2 border text-left">{t("col_type", lang)}</th>
                <th className="p-2 border text-right">{t("col_irritation", lang)}</th>
                <th className="p-2 border text-left">{t("col_verdict", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {safetyReports.map((r) => {
                const sd = r.safety_data;
                return (
                  <tr key={r.report_code} className="hover:bg-gray-50">
                    <td className="p-2 border">{r.report_code}</td>
                    <td className="p-2 border">{tProduct(sd?.product ?? "", lang)}</td>
                    <td className="p-2 border">{tSafety(sd?.title ?? "", lang)}</td>
                    <td className="p-2 border text-right">{sd?.irritation_index ?? "-"}</td>
                    <td className="p-2 border font-semibold text-green-700">
                      {tSafety(sd?.result ?? "", lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
