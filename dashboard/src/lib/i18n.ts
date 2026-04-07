import { Lang } from "./types";

const T: Record<string, Record<Lang, string>> = {
  hero_title: {
    ko: "음압패치 효과 검증 대시보드",
    en: "Cupping Patch Efficacy Dashboard",
    ja: "陰圧パッチ効果検証ダッシュボード",
  },
  hero_subtitle: {
    ko: "14개 임상시험 PDF 데이터 기반 — 패치 부가효과 지표별/제품별 비교",
    en: "Based on 14 clinical trial PDF reports — Patch add-on efficacy by metric & product",
    ja: "14件の臨床試験PDFデータに基づく — パッチ付加効果を指標別・製品別に比較",
  },
  kpi_products: {
    ko: "{count}개 제품 평균 +{avg}%",
    en: "{count} products avg +{avg}%",
    ja: "{count}製品 平均 +{avg}%",
  },
  sec2_title: {
    ko: "2. 지표별 시험군 vs 대조군 개선율",
    en: "2. Test vs Control Improvement by Metric",
    ja: "2. 指標別 試験群 vs 対照群 改善率",
  },
  sec3_title: {
    ko: "3. 제품 × 지표 — 대조군 대비 개선율(%)",
    en: "3. Product × Metric — Comparative Improvement (%)",
    ja: "3. 製品 × 指標 — 対照群比改善率（%）",
  },
  sec4_title: {
    ko: "4. 흡수도 비교 (패치 유/무)",
    en: "4. Absorption Comparison (With/Without Patch)",
    ja: "4. 吸収度比較（パッチ有/無）",
  },
  sec5_title: {
    ko: "5. 안전성 요약",
    en: "5. Safety Summary",
    ja: "5. 安全性まとめ",
  },
  sec6_title: {
    ko: "6. 데이터 출처 — 보고서 목록",
    en: "6. Data Sources — Report List",
    ja: "6. データ出典 — 報告書一覧",
  },
  filter_all: { ko: "전체", en: "All", ja: "すべて" },
  filter_metric: { ko: "지표 선택", en: "Select Metric", ja: "指標を選択" },
  legend_test: {
    ko: "시험군(제품+패치)",
    en: "Test (Product+Patch)",
    ja: "試験群（製品+パッチ）",
  },
  legend_control: {
    ko: "대조군(제품 단독)",
    en: "Control (Product Only)",
    ja: "対照群（製品のみ）",
  },
  axis_improvement: {
    ko: "개선율(%)",
    en: "Improvement (%)",
    ja: "改善率(%)",
  },
  safety_adverse: { ko: "이상반응", en: "Adverse Reactions", ja: "有害反応" },
  safety_adverse_val: { ko: "0건", en: "0 cases", ja: "0件" },
  safety_adverse_detail: { ko: "전 제품 전 기간", en: "All products, all periods", ja: "全製品・全期間" },
  safety_irritation: { ko: "자극지수", en: "Irritation Index", ja: "刺激指数" },
  safety_irritation_detail: { ko: "전 제품 비자극성", en: "All non-irritant", ja: "全製品 非刺激性" },
  safety_compliance: { ko: "순응도", en: "Compliance", ja: "順守度" },
  safety_compliance_detail: { ko: "전 시험 평균", en: "Average across all trials", ja: "全試験平均" },
  safety_satisfaction: { ko: "설문 만족도", en: "Satisfaction", ja: "満足度" },
  safety_satisfaction_detail: { ko: "긍정 응답률", en: "Positive response rate", ja: "肯定的回答率" },
  col_report: { ko: "보고서 코드", en: "Report Code", ja: "報告書コード" },
  col_product: { ko: "제품", en: "Product", ja: "製品" },
  col_type: { ko: "시험유형", en: "Trial Type", ja: "試験種別" },
  col_duration: { ko: "기간", en: "Duration", ja: "期間" },
  col_subjects: { ko: "피험자(명)", en: "Subjects", ja: "被験者(名)" },
  col_metric: { ko: "지표", en: "Metric", ja: "指標" },
  col_test: { ko: "시험군(%)", en: "Test(%)", ja: "試験群(%)" },
  col_ctrl: { ko: "대조군(%)", en: "Control(%)", ja: "対照群(%)" },
  col_comp: { ko: "대조군 대비(%)", en: "Comparative(%)", ja: "対照群比(%)" },
  col_pvalue: { ko: "p-value", en: "p-value", ja: "p値" },
  col_irritation: { ko: "자극지수", en: "Irritation Index", ja: "刺激指数" },
  col_verdict: { ko: "판정", en: "Verdict", ja: "判定" },
  type_efficacy: { ko: "효능", en: "Efficacy", ja: "効能" },
  type_absorption: { ko: "흡수도", en: "Absorption", ja: "吸収度" },
  type_safety: { ko: "안전성", en: "Safety", ja: "安全性" },
  tab_efficacy: { ko: "효능 비교", en: "Efficacy", ja: "効能比較" },
  tab_absorption: { ko: "흡수도", en: "Absorption", ja: "吸収度" },
  tab_safety: { ko: "안전성", en: "Safety", ja: "安全性" },
  tab_sources: { ko: "데이터 출처", en: "Data Sources", ja: "データ出典" },
  pilot_label: { ko: "[예비]", en: "[Pilot]", ja: "[予備]" },
};

export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = T[key];
  let text = entry?.[lang] ?? entry?.ko ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

const METRIC_NAMES: Record<string, Record<string, string>> = {
  "보습": { en: "Moisturizing", ja: "保湿" },
  "탄력": { en: "Elasticity", ja: "弾力" },
  "주름(눈가)": { en: "Wrinkles (Eye)", ja: "シワ（目元）" },
  "주름(팔자)": { en: "Wrinkles (Nasolabial)", ja: "シワ（ほうれい線）" },
  "주름": { en: "Wrinkles", ja: "シワ" },
  "피부결": { en: "Skin Texture", ja: "肌キメ" },
  "피부밀도": { en: "Skin Density", ja: "肌密度" },
  "모공": { en: "Pores", ja: "毛穴" },
  "리프팅": { en: "Lifting", ja: "リフティング" },
  "다크서클": { en: "Dark Circles", ja: "ダークサークル" },
  "색소": { en: "Pigmentation", ja: "色素沈着" },
  "피부 광": { en: "Skin Glow", ja: "肌ツヤ" },
  "흡수량": { en: "Absorption Amount", ja: "吸収量" },
  "흡수 깊이": { en: "Absorption Depth", ja: "吸収深さ" },
  "흡수 속도": { en: "Absorption Speed", ja: "吸収速度" },
};

const PRODUCT_NAMES: Record<string, Record<string, string>> = {
  "옥타겔": { en: "OctaGel", ja: "オクタゲル" },
  "GFC셀 파우더+솔루션": { en: "GFC Cell Powder+Solution", ja: "GFCセルパウダー+ソリューション" },
  "GFC셀 파우더+솔루션+MTS": { en: "GFC Cell+Solution+MTS", ja: "GFCセル+ソリューション+MTS" },
  "Stem Science Eye 크림": { en: "Stem Science Eye Cream", ja: "Stem Science Eyeクリーム" },
  "Clini Science Eye 크림": { en: "Clini Science Eye Cream", ja: "Clini Science Eyeクリーム" },
  "Exo H-Serum": { en: "Exo H-Serum", ja: "Exo H-Serum" },
  "뉴라덤 코어타임 앰플": { en: "Neuraderm CoreTime Ampoule", ja: "ニューラダーム コアタイム アンプル" },
  "CNP 더마 앤서 앰플": { en: "CNP Derma Answer Ampoule", ja: "CNPダーマアンサーアンプル" },
  "성분에디터 앰플+패치": { en: "Ingredient Editor Ampoule+Patch", ja: "成分エディターアンプル+パッチ" },
  "성분에디터 앰플+패치A/B": { en: "Ingredient Editor Ampoule+Patch A/B", ja: "成分エディターアンプル+パッチA/B" },
  "문어 흡반 구조 모사 피부 패치": { en: "Octopus Sucker Skin Patch", ja: "タコ吸盤構造模倣パッチ" },
  "Stem Science Eye+음압패치": { en: "Stem Science Eye+Cupping Patch", ja: "Stem Science Eye+陰圧パッチ" },
  "Clini Science Eye+음압패치": { en: "Clini Science Eye+Cupping Patch", ja: "Clini Science Eye+陰圧パッチ" },
};

const SAFETY_MAP: Record<string, Record<string, string>> = {
  "비자극성": { en: "Non-irritant", ja: "非刺激性" },
  "자극테스트": { en: "Irritation Test", ja: "刺激テスト" },
  "저자극테스트": { en: "Hypoallergenic Test", ja: "低刺激テスト" },
};

const BODY_PARTS: Record<string, Record<string, string>> = {
  "뺨": { en: "Cheek", ja: "頬" },
  "전박": { en: "Forearm", ja: "前腕" },
};

export function tMetric(name: string, lang: Lang): string {
  if (lang === "ko") return name;
  return METRIC_NAMES[name]?.[lang] ?? name;
}

export function tProduct(name: string, lang: Lang): string {
  if (lang === "ko") return name;
  return PRODUCT_NAMES[name]?.[lang] ?? name;
}

export function tSafety(name: string, lang: Lang): string {
  if (lang === "ko") return name;
  return SAFETY_MAP[name]?.[lang] ?? name;
}

export function tBodyPart(name: string, lang: Lang): string {
  if (lang === "ko") return name;
  return BODY_PARTS[name]?.[lang] ?? name;
}
