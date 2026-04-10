import { Lang } from "./types";

const T: Record<string, Record<Lang, string>> = {
  hero_title: {
    ko: "휴먼피부임상센터 음압패치 임상결과",
    en: "Human Skin Clinical Center — Cupping Patch Clinical Results",
    ja: "ヒューマン皮膚臨床センター 陰圧パッチ臨床結果",
  },
  hero_subtitle: {
    ko: "18개 임상시험 PDF 데이터 기반 — 패치 부가효과 지표별/제품별 비교",
    en: "Based on 18 clinical trial PDF reports — Patch add-on efficacy by metric & product",
    ja: "18件の臨床試験PDFデータに基づく — パッチ付加効果を指標別・製品別に比較",
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
  tab_advisor: { ko: "AI 어드바이저", en: "AI Advisor", ja: "AIアドバイザー" },
  nav_heatmap: { ko: "히트맵", en: "Heatmap", ja: "ヒートマップ" },
  pilot_label: { ko: "[예비]", en: "[Pilot]", ja: "[予備]" },

  // ── AI 어드바이저 ──
  advisor_title: {
    ko: "7. AI 임상데이터 어드바이저",
    en: "7. AI Clinical Data Advisor",
    ja: "7. AI臨床データアドバイザー",
  },
  advisor_intro: {
    ko: "18개 임상시험 데이터를 학습한 AI가 궁금한 점에 답변합니다. 예: <strong>\"탄력 개선에 가장 효과적인 제품은?\"</strong>, <strong>\"보습 지표의 p-value 의미를 설명해줘\"</strong>, <strong>\"음압패치의 작용 원리는?\"</strong>",
    en: "AI trained on 18 clinical trial datasets answers your questions. Try: <strong>\"Which product is most effective for elasticity?\"</strong>, <strong>\"Explain the p-value for moisturizing\"</strong>, <strong>\"How does the cupping patch work?\"</strong>",
    ja: "18件の臨床試験データを学習したAIがご質問にお答えします。例: <strong>「弾力改善に最も効果的な製品は？」</strong>、<strong>「保湿指標のp値の意味を説明して」</strong>、<strong>「陰圧パッチの作用原理は？」</strong>",
  },
  advisor_no_key: {
    ko: "API 키가 설정되지 않았습니다. 관리자에게 문의하세요.",
    en: "API key is not configured. Please contact the administrator.",
    ja: "APIキーが設定されていません。管理者にお問い合わせください。",
  },
  advisor_placeholder: {
    ko: "임상 결과에 대해 질문하세요...",
    en: "Ask about clinical trial results...",
    ja: "臨床試験結果について質問してください...",
  },
  advisor_error: {
    ko: "응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
    en: "An error occurred while generating the response. Please try again.",
    ja: "回答生成中にエラーが発生しました。もう一度お試しください。",
  },
  advisor_thinking: {
    ko: "답변 생성 중...",
    en: "Generating response...",
    ja: "回答生成中...",
  },

  // ── 섹션별 인사이트 ──
  insight_kpi: {
    ko: "음압패치를 함께 사용하면 제품 단독 사용 대비 모든 지표에서 유의미한 추가 개선 효과가 확인되었습니다. 특히 탄력(+211%), 주름(+171%), 보습(+159%)에서 가장 높은 부가효과를 보였으며, 대부분의 지표에서 군간 차이가 통계적으로 유의(p<0.05)합니다.",
    en: "Using the cupping patch alongside products showed significant add-on improvements across all metrics. Elasticity (+211%), wrinkles (+171%), and moisturizing (+159%) showed the highest add-on effects, with most metrics showing statistically significant between-group differences (p<0.05).",
    ja: "陰圧パッチを併用することで、全指標で有意な追加改善効果が確認されました。特に弾力(+211%)、シワ(+171%)、保湿(+159%)で最も高い付加効果を示し、ほとんどの指標で群間差が統計的に有意(p<0.05)です。",
  },
  insight_efficacy: {
    ko: "시험군(제품+패치)은 대조군(제품 단독)보다 일관되게 높은 개선율을 보입니다. 지표별 버튼을 클릭하면 각 제품의 시험군/대조군 개선율과 대조군 대비 개선율(빨간 배지)을 확인할 수 있습니다.",
    en: "The test group (product + patch) consistently shows higher improvement than the control group (product only). Click metric buttons to see per-product test/control rates and comparative improvement (red badge).",
    ja: "試験群（製品+パッチ）は対照群（製品のみ）より一貫して高い改善率を示しています。指標ボタンをクリックすると、製品別の試験群/対照群改善率と対照群比改善率（赤バッジ）を確認できます。",
  },
  insight_heatmap: {
    ko: "색이 진할수록 패치 부가효과가 큰 조합입니다. 옥타겔(HM-R25-1063)이 가장 다양한 지표에서 높은 효과를 보였고, 색소(최대 216%)와 탄력(최대 211%) 지표에서 전반적으로 높은 부가효과가 관찰됩니다.",
    en: "Darker cells indicate stronger patch add-on effects. OctaGel (HM-R25-1063) showed high effects across the most metrics. Pigmentation (up to 216%) and elasticity (up to 211%) showed the highest overall add-on effects.",
    ja: "色が濃いほどパッチ付加効果が大きい組み合わせです。オクタゲル(HM-R25-1063)が最も多くの指標で高い効果を示し、色素沈着(最大216%)と弾力(最大211%)で全体的に高い付加効果が観察されます。",
  },
  insight_absorption: {
    ko: "음압패치의 가장 근본적인 효과인 피부 흡수 증진을 보여줍니다. 패치 사용 시 흡수 깊이가 최대 +383%, 흡수량이 최대 +322% 증가하여, 유효 성분이 피부 깊숙이 전달됨을 확인할 수 있습니다.",
    en: "Shows the most fundamental effect of the cupping patch — enhanced skin absorption. With the patch, absorption depth increased up to +383% and absorption amount up to +322%, confirming deeper delivery of active ingredients.",
    ja: "陰圧パッチの最も基本的な効果である皮膚吸収促進を示しています。パッチ使用時、吸収深さが最大+383%、吸収量が最大+322%増加し、有効成分が肌深部に届くことが確認されました。",
  },
  insight_safety: {
    ko: "전 제품·전 기간에 걸쳐 이상반응 0건, 자극지수 0.07~0.18(모두 비자극성 판정)으로 음압패치의 안전성이 임상적으로 확인되었습니다. 순응도 99.3~100%, 만족도 85~100%로 사용감도 우수합니다.",
    en: "Zero adverse reactions across all products and periods, irritation indices 0.07–0.18 (all non-irritant) clinically confirm the patch's safety. Compliance 99.3–100% and satisfaction 85–100% indicate excellent usability.",
    ja: "全製品・全期間で有害反応0件、刺激指数0.07〜0.18（全て非刺激性）で安全性が臨床的に確認されました。順守度99.3〜100%、満足度85〜100%で使用感も優れています。",
  },

  // ── 사이드바 가이드 ──
  guide_title: {
    ko: "대시보드 사용 가이드",
    en: "Dashboard Guide",
    ja: "ダッシュボード使用ガイド",
  },
  guide_overview: {
    ko: "이 대시보드는 18개 임상시험 보고서(휴먼테스트 수행)에서 추출한 데이터를 시각화합니다. 음압패치를 함께 사용했을 때의 부가효과를 지표별·제품별로 비교할 수 있습니다.",
    en: "This dashboard visualizes data extracted from 18 clinical trial reports. Compare the add-on effects of the cupping patch by metric and product.",
    ja: "このダッシュボードは18件の臨床試験報告書から抽出したデータを視覚化します。指標別・製品別にパッチの付加効果を比較できます。",
  },
  guide_how_title: {
    ko: "사용 방법",
    en: "How to Use",
    ja: "使い方",
  },
  guide_step1: {
    ko: "상단 KPI 카드에서 핵심 지표의 패치 부가효과를 한눈에 확인하세요.",
    en: "Check the key patch add-on metrics at a glance from the top KPI cards.",
    ja: "上部のKPIカードでパッチ付加効果の主要指標を一目で確認してください。",
  },
  guide_step2: {
    ko: "지표 버튼(보습, 탄력, 주름 등)을 클릭하면 제품별 시험군/대조군 비교 차트가 표시됩니다.",
    en: "Click metric buttons (Moisturizing, Elasticity, etc.) to see per-product test vs control comparison.",
    ja: "指標ボタンをクリックすると、製品別の試験群/対照群比較チャートが表示されます。",
  },
  guide_step3: {
    ko: "히트맵에서 색상이 진한 셀일수록 패치 효과가 큰 제품×지표 조합입니다.",
    en: "In the heatmap, darker cells indicate stronger patch effect for that product×metric combination.",
    ja: "ヒートマップで色が濃いセルほどパッチ効果が大きい製品×指標の組み合わせです。",
  },
  guide_step4: {
    ko: "흡수도 탭에서 흡수 깊이/속도/량별로 패치 유무 비교를 확인하세요.",
    en: "Check absorption depth/speed/amount comparison with and without patch in the Absorption tab.",
    ja: "吸収度タブで吸収深さ/速度/量別にパッチ有無の比較を確認してください。",
  },
  guide_step5: {
    ko: "안전성 섹션에서 전 제품의 이상반응·자극지수·순응도·만족도를 확인할 수 있습니다.",
    en: "The Safety section shows adverse reactions, irritation index, compliance, and satisfaction for all products.",
    ja: "安全性セクションで全製品の有害反応・刺激指数・順守度・満足度を確認できます。",
  },
  guide_step6: {
    ko: "우측 상단 드롭다운에서 한국어/English/日本語로 언어를 변경할 수 있습니다.",
    en: "Switch language via the dropdown at the top right: 한국어 / English / 日本語.",
    ja: "右上のドロップダウンから韓国語/English/日本語に言語を切り替えられます。",
  },
  guide_terms_title: {
    ko: "주요 용어",
    en: "Key Terms",
    ja: "主要用語",
  },
  guide_term_test: {
    ko: "시험군: 제품 + 음압패치 함께 사용",
    en: "Test group: Product + cupping patch",
    ja: "試験群: 製品 + 陰圧パッチ併用",
  },
  guide_term_control: {
    ko: "대조군: 제품만 단독 사용",
    en: "Control group: Product only",
    ja: "対照群: 製品のみ使用",
  },
  guide_term_comp: {
    ko: "대조군 대비(%): 패치 부가효과의 크기. 값이 클수록 패치 효과가 큼",
    en: "Comparative (%): Size of the patch add-on effect. Higher = stronger patch effect",
    ja: "対照群比(%): パッチ付加効果の大きさ。値が大きいほどパッチ効果が大きい",
  },
  guide_term_pvalue: {
    ko: "p<0.05: 시험군과 대조군의 차이가 통계적으로 유의함",
    en: "p<0.05: Statistically significant difference between test and control groups",
    ja: "p<0.05: 試験群と対照群の差が統計的に有意",
  },
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
  "경피수분손실량": { en: "TEWL", ja: "経皮水分蒸散量" },
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
  "임상시험용 앰플": { en: "Clinical Trial Ampoule", ja: "臨床試験用アンプル" },
  "겔(화장품 조성물)": { en: "Gel (Cosmetic Composition)", ja: "ゲル（化粧品組成物）" },
  "미션 크리스탈 젤리 아이&페이스+음압패치": { en: "Mission Crystal Jelly Eye&Face+Cupping Patch", ja: "ミッションクリスタルジェリーアイ&フェイス+陰圧パッチ" },
  "미션 크리스탈 젤리 아이&페이스": { en: "Mission Crystal Jelly Eye&Face", ja: "ミッションクリスタルジェリーアイ&フェイス" },
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
