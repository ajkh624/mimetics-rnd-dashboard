"""다국어 번역 사전 — 한국어(ko), 영어(en), 일본어(ja)."""

TRANSLATIONS = {
    # ── 페이지 설정 ──
    "page_title": {
        "ko": "음압패치 효과 검증 대시보드",
        "en": "Cupping Patch Efficacy Dashboard",
        "ja": "陰圧パッチ効果検証ダッシュボード",
    },

    # ── 히어로 헤더 ──
    "hero_title": {
        "ko": "음압패치 효과 검증 대시보드",
        "en": "Cupping Patch Efficacy Dashboard",
        "ja": "陰圧パッチ効果検証ダッシュボード",
    },
    "hero_subtitle": {
        "ko": "14개 임상시험 PDF 데이터 기반 — 패치 부가효과 지표별/제품별 비교",
        "en": "Based on 14 clinical trial PDF reports — Patch add-on efficacy by metric & product",
        "ja": "14件の臨床試験PDFデータに基づく — パッチ付加効果を指標別・製品別に比較",
    },

    # ── 섹션 1: KPI ──
    "sec1_title": {
        "ko": "1. 패치 부가효과 핵심 지표",
        "en": "1. Key Patch Add-on Efficacy Metrics",
        "ja": "1. パッチ付加効果の主要指標",
    },
    "sec1_explain": {
        "ko": """
        <strong>이 섹션의 의미:</strong> 음압패치를 함께 사용했을 때 제품만 단독 사용한 경우 대비 얼마나 더 효과적인지를 한눈에 보여줍니다.<br><br>
        <strong>계산 방법:</strong> 각 임상시험 보고서에서 <em>시험군(제품+패치)</em>의 개선율과 <em>대조군(제품 단독)</em>의 개선율을 추출한 뒤,
        <code>대조군 대비 개선율(%) = |시험군 개선율 - 대조군 개선율| / 대조군 개선율 × 100</code> 공식으로 산출합니다.
        카드에 표시된 범위는 해당 지표를 측정한 <strong>모든 보고서</strong>의 대조군 대비 개선율 중 최솟값~최댓값입니다.<br><br>
        <strong>해석:</strong> 예를 들어 탄력 <em>+84~211%</em>는, 패치를 함께 사용하면 제품만 사용했을 때보다 탄력 개선 효과가 84%에서 최대 211%까지 더 높다는 뜻입니다.
        <em>p&lt;0.05</em> 표시는 시험군과 대조군 간 차이가 통계적으로 유의하다는 의미입니다.
        """,
        "en": """
        <strong>What this section shows:</strong> How much more effective the product becomes when used with the cupping patch, compared to the product alone.<br><br>
        <strong>Calculation:</strong> From each clinical trial report, the improvement rate of the <em>test group (product + patch)</em> and the <em>control group (product only)</em> are extracted.
        <code>Comparative improvement (%) = |Test improvement − Control improvement| / Control improvement × 100</code>.
        The range shown on each card is the min–max of comparative improvement across <strong>all reports</strong> that measured the metric.<br><br>
        <strong>Interpretation:</strong> For example, elasticity <em>+84–211%</em> means the patch adds 84% to 211% more elasticity improvement over product-only use.
        <em>p&lt;0.05</em> indicates a statistically significant difference between groups.
        """,
        "ja": """
        <strong>このセクションの意味:</strong> 陰圧パッチを併用した場合、製品単独使用と比べてどれだけ効果が向上するかを一目で示します。<br><br>
        <strong>計算方法:</strong> 各臨床試験報告書から<em>試験群（製品+パッチ）</em>の改善率と<em>対照群（製品のみ）</em>の改善率を抽出し、
        <code>対照群比改善率(%) = |試験群改善率 − 対照群改善率| / 対照群改善率 × 100</code>で算出します。
        カードに表示される範囲は、当該指標を測定した<strong>全報告書</strong>の対照群比改善率の最小値〜最大値です。<br><br>
        <strong>解釈:</strong> 例えば弾力 <em>+84〜211%</em> は、パッチ併用により製品単独使用時より弾力改善効果が84%〜最大211%高いことを意味します。
        <em>p&lt;0.05</em>は群間差が統計的に有意であることを示します。
        """,
    },
    "kpi_products_avg": {
        "ko": "{count}개 제품 평균 +{avg:.0f}%",
        "en": "{count} products avg +{avg:.0f}%",
        "ja": "{count}製品 平均 +{avg:.0f}%",
    },

    # ── 섹션 2: 막대 차트 ──
    "sec2_title": {
        "ko": "2. 지표별 시험군 vs 대조군 개선율",
        "en": "2. Test vs Control Improvement by Metric",
        "ja": "2. 指標別 試験群 vs 対照群 改善率",
    },
    "sec2_explain_detail": {
        "ko": """
        <strong>이 차트의 의미:</strong> <em>{metric}</em> 지표에 대해 각 제품별로 시험군(제품+패치)과 대조군(제품 단독)의 개선율을 나란히 비교합니다.<br><br>
        <strong>계산 방법:</strong> 각 보고서의 5장(시험 결과)에서 해당 지표의 <em>시험제품 사용 전 대비 사용 후</em> 개선율(%)을 시험군/대조군 각각 추출합니다.
        복수 시점이 있는 경우(예: 2주, 4주) 가장 긴 기간의 값을 표시합니다.<br><br>
        <strong>해석:</strong> 빨간 막대(시험군)가 초록 막대(대조군)보다 길수록 패치의 부가효과가 큰 것입니다.
        """,
        "en": """
        <strong>What this chart shows:</strong> Side-by-side comparison of test group (product + patch) vs control group (product only) improvement rates for <em>{metric}</em>.<br><br>
        <strong>Calculation:</strong> Improvement rates (%) are extracted from Chapter 5 (Results) of each report — <em>before vs after product use</em> for each group.
        When multiple time points exist (e.g. 2 weeks, 4 weeks), the longest-duration value is shown.<br><br>
        <strong>Interpretation:</strong> The longer the red bar (test group) compared to the green bar (control), the greater the patch add-on effect.
        """,
        "ja": """
        <strong>このチャートの意味:</strong> <em>{metric}</em>指標について、各製品の試験群（製品+パッチ）と対照群（製品のみ）の改善率を並べて比較します。<br><br>
        <strong>計算方法:</strong> 各報告書の第5章（試験結果）から、当該指標の<em>使用前対比使用後</em>改善率(%)を試験群・対照群それぞれ抽出します。
        複数時点がある場合（例: 2週、4週）、最長期間の値を表示します。<br><br>
        <strong>解釈:</strong> 赤い棒（試験群）が緑の棒（対照群）より長いほど、パッチの付加効果が大きいことを示します。
        """,
    },
    "sec2_explain_overview": {
        "ko": """
        <strong>이 차트의 의미:</strong> 모든 지표의 <em>대조군 대비 개선율</em> 범위를 한눈에 비교합니다.
        다이아몬드(◆)는 해당 지표의 평균값이고, 막대는 최솟값~최댓값 범위입니다.<br><br>
        <strong>계산 방법:</strong> 각 지표를 측정한 모든 보고서의 대조군 대비 개선율을 수집하여 min/max/평균을 산출합니다.<br><br>
        <strong>해석:</strong> 막대가 오른쪽으로 길수록 패치 효과가 큰 지표입니다. 사이드바에서 특정 지표를 선택하면 제품별 상세 비교를 볼 수 있습니다.
        """,
        "en": """
        <strong>What this chart shows:</strong> An overview of <em>comparative improvement rates</em> across all metrics.
        The diamond (◆) marks the average, and the bar spans the min–max range.<br><br>
        <strong>Calculation:</strong> Comparative improvement rates from all reports measuring each metric are collected to compute min/max/average.<br><br>
        <strong>Interpretation:</strong> Longer bars = greater patch effect. Select a specific metric in the sidebar for a detailed per-product breakdown.
        """,
        "ja": """
        <strong>このチャートの意味:</strong> 全指標の<em>対照群比改善率</em>の範囲を一覧で比較します。
        ダイヤモンド（◆）は平均値、棒は最小値〜最大値の範囲です。<br><br>
        <strong>計算方法:</strong> 各指標を測定した全報告書の対照群比改善率を集計し、最小/最大/平均を算出します。<br><br>
        <strong>解釈:</strong> 棒が右に長いほどパッチ効果が大きい指標です。サイドバーで特定の指標を選択すると、製品別の詳細比較が表示されます。
        """,
    },
    "filter_title": {
        "ko": "필터",
        "en": "Filters",
        "ja": "フィルター",
    },
    "filter_metric": {
        "ko": "지표 선택",
        "en": "Select Metric",
        "ja": "指標を選択",
    },
    "filter_all": {
        "ko": "전체",
        "en": "All",
        "ja": "すべて",
    },
    "filter_report": {
        "ko": "보고서 선택",
        "en": "Select Reports",
        "ja": "報告書を選択",
    },

    # ── 섹션 3: 히트맵 ──
    "sec3_title": {
        "ko": "3. 제품 x 지표 — 대조군 대비 개선율(%)",
        "en": "3. Product × Metric — Comparative Improvement (%)",
        "ja": "3. 製品 × 指標 — 対照群比改善率（%）",
    },
    "sec3_explain": {
        "ko": """
        <strong>이 히트맵의 의미:</strong> 어떤 제품이 어떤 지표에서 패치 효과가 크게 나타났는지를 한 화면에서 파악할 수 있습니다.<br><br>
        <strong>계산 방법:</strong> 행은 제품, 열은 지표이며, 각 셀의 값은 해당 보고서의 <em>대조군 대비 개선율(%)</em>입니다.
        복수 시점이 있는 경우 가장 긴 기간의 값을 사용합니다. 같은 제품-지표 조합이 여러 보고서에 있으면 최댓값을 표시합니다.<br><br>
        <strong>해석:</strong> 색이 진할수록(빨간색) 패치를 함께 사용했을 때 개선 효과의 차이가 큰 것입니다.
        빈 칸("-")은 해당 조합의 시험이 수행되지 않았음을 의미합니다.
        """,
        "en": """
        <strong>What this heatmap shows:</strong> Which product–metric combinations show the strongest patch add-on effect, at a glance.<br><br>
        <strong>Calculation:</strong> Rows are products, columns are metrics, and each cell value is the <em>comparative improvement (%)</em> from the report.
        When multiple time points exist, the longest-duration value is used. If multiple reports cover the same product–metric pair, the maximum value is shown.<br><br>
        <strong>Interpretation:</strong> Darker cells (red) indicate a larger difference in improvement when the patch is used.
        Empty cells ("-") mean no trial was conducted for that combination.
        """,
        "ja": """
        <strong>このヒートマップの意味:</strong> どの製品がどの指標でパッチ効果が大きかったかを一画面で把握できます。<br><br>
        <strong>計算方法:</strong> 行は製品、列は指標で、各セルの値は該当報告書の<em>対照群比改善率（%）</em>です。
        複数時点がある場合は最長期間の値を使用します。同じ製品-指標の組み合わせが複数の報告書にある場合は最大値を表示します。<br><br>
        <strong>解釈:</strong> 色が濃いほど（赤色）パッチ併用時の改善効果の差が大きいことを示します。
        空欄（「-」）は該当する試験が実施されていないことを意味します。
        """,
    },
    "sec3_expander": {
        "ko": "상세 데이터 테이블 (보고서 코드 포함)",
        "en": "Detailed Data Table (incl. report codes)",
        "ja": "詳細データテーブル（報告書コード付き）",
    },

    # ── 섹션 4: 흡수도 ──
    "sec4_title": {
        "ko": "4. 흡수도 비교 (패치 유/무)",
        "en": "4. Absorption Comparison (With/Without Patch)",
        "ja": "4. 吸収度比較（パッチ有/無）",
    },
    "sec4_explain": {
        "ko": """
        <strong>이 섹션의 의미:</strong> 음압패치의 가장 근본적인 효과인 <em>피부 흡수 증진</em>을 보여줍니다.
        패치가 피부에 음압(흡입력)을 가해 유효 성분의 흡수량, 흡수 깊이, 흡수 속도를 높입니다.<br><br>
        <strong>계산 방법:</strong> 3D Raman Spectroscopy로 시험제품 사용 전/후 피부 내 성분의 양(A.U.), 침투 깊이(㎛), 침투 속도(㎛/h)를 측정합니다.
        <code>개선율(%) = |사용 후 - 사용 전| / 사용 전 × 100</code>,
        <code>대조군 대비(%) = |시험군 개선율 - 대조군 개선율| / 대조군 개선율 × 100</code>.<br><br>
        <strong>해석:</strong> 빨간 막대(시험군=패치 사용)가 초록 막대(대조군=패치 미사용)보다 길수록 패치 효과가 큰 것입니다.
        <em>[예비]</em> 표시는 소규모(n≤5) 예비시험을 의미합니다.
        """,
        "en": """
        <strong>What this section shows:</strong> The most fundamental effect of the cupping patch — <em>enhanced skin absorption</em>.
        The patch applies negative pressure (suction) to the skin, increasing the amount, depth, and speed of active ingredient absorption.<br><br>
        <strong>Calculation:</strong> 3D Raman Spectroscopy measures the amount of ingredients in the skin (A.U.), penetration depth (㎛), and speed (㎛/h) before/after product use.
        <code>Improvement (%) = |After − Before| / Before × 100</code>,
        <code>Comparative (%) = |Test improvement − Control improvement| / Control improvement × 100</code>.<br><br>
        <strong>Interpretation:</strong> The longer the red bar (test = with patch) vs the green bar (control = without patch), the greater the absorption enhancement.
        <em>[Pilot]</em> marks small-scale preliminary trials (n≤5).
        """,
        "ja": """
        <strong>このセクションの意味:</strong> 陰圧パッチの最も基本的な効果である<em>皮膚吸収促進</em>を示します。
        パッチが皮膚に陰圧（吸引力）を加え、有効成分の吸収量・吸収深さ・吸収速度を高めます。<br><br>
        <strong>計算方法:</strong> 3D Raman Spectroscopyで使用前後の皮膚内成分量(A.U.)、浸透深さ(㎛)、浸透速度(㎛/h)を測定します。
        <code>改善率(%) = |使用後 − 使用前| / 使用前 × 100</code>、
        <code>対照群比(%) = |試験群改善率 − 対照群改善率| / 対照群改善率 × 100</code>。<br><br>
        <strong>解釈:</strong> 赤い棒（試験群＝パッチ使用）が緑の棒（対照群＝パッチ未使用）より長いほど吸収促進効果が大きいことを示します。
        <em>[予備]</em>は少数（n≤5）の予備試験を意味します。
        """,
    },
    "sec4_expander": {
        "ko": "흡수도 상세 데이터 테이블",
        "en": "Absorption Detailed Data Table",
        "ja": "吸収度詳細データテーブル",
    },
    "pilot_label": {
        "ko": "[예비]",
        "en": "[Pilot]",
        "ja": "[予備]",
    },

    # ── 섹션 5: 안전성 ──
    "sec5_title": {
        "ko": "5. 안전성 요약",
        "en": "5. Safety Summary",
        "ja": "5. 安全性まとめ",
    },
    "sec5_explain": {
        "ko": """
        <strong>이 섹션의 의미:</strong> 음압패치와 제품 조합의 안전성을 확인합니다. 피부 자극, 이상반응, 사용 순응도, 피험자 만족도를 종합적으로 보여줍니다.<br><br>
        <strong>계산 방법:</strong><br>
        &bull; <strong>이상반응</strong>: 전체 시험 기간 중 시험담당자 관찰 + 피험자 설문으로 보고된 홍반, 부종, 가려움, 작열감 등 8개 항목 합산<br>
        &bull; <strong>자극지수</strong>: Finn Chamber 첩포시험 — 패치를 24시간 부착 후 피부과전문의가 30분/24시간 후 판정. 0.00~0.25 = 비자극성<br>
        &bull; <strong>순응도</strong>: (실제 사용 횟수 / 사용해야 할 횟수) × 100. 80% 미만 시 분석에서 제외<br>
        &bull; <strong>설문 만족도</strong>: 6점 척도(매우 동의~매우 비동의) 중 긍정 응답(약간 동의+동의+매우 동의) 비율<br><br>
        <strong>해석:</strong> 모든 지표가 녹색이면 안전성 우려가 없음을 의미합니다.
        """,
        "en": """
        <strong>What this section shows:</strong> Safety profile of the cupping patch + product combinations — skin irritation, adverse reactions, compliance, and satisfaction.<br><br>
        <strong>Calculation:</strong><br>
        &bull; <strong>Adverse reactions</strong>: Sum of 8 items (erythema, edema, itching, burning, etc.) observed by investigators + reported by subjects across all trial periods<br>
        &bull; <strong>Irritation index</strong>: Finn Chamber patch test — patch applied for 24 hours, evaluated by dermatologist at 30 min / 24 h after removal. 0.00–0.25 = non-irritant<br>
        &bull; <strong>Compliance</strong>: (Actual uses / Required uses) × 100. Subjects below 80% are excluded from analysis<br>
        &bull; <strong>Satisfaction</strong>: Percentage of positive responses (slightly agree + agree + strongly agree) on a 6-point scale<br><br>
        <strong>Interpretation:</strong> All green indicators mean no safety concerns.
        """,
        "ja": """
        <strong>このセクションの意味:</strong> 陰圧パッチと製品の組み合わせの安全性を確認します。皮膚刺激、有害反応、使用順守度、被験者満足度を総合的に示します。<br><br>
        <strong>計算方法:</strong><br>
        &bull; <strong>有害反応</strong>: 全試験期間中、試験担当者の観察＋被験者アンケートで報告された紅斑、浮腫、かゆみ、灼熱感など8項目の合計<br>
        &bull; <strong>刺激指数</strong>: Finn Chamberパッチテスト — パッチを24時間貼付後、皮膚科専門医が30分後/24時間後に判定。0.00〜0.25 = 非刺激性<br>
        &bull; <strong>順守度</strong>: (実使用回数 / 使用すべき回数) × 100。80%未満は分析から除外<br>
        &bull; <strong>満足度</strong>: 6段階評価のうち肯定的回答（やや同意＋同意＋非常に同意）の割合<br><br>
        <strong>解釈:</strong> すべての指標が緑色であれば安全性の懸念はありません。
        """,
    },
    "safety_adverse": {
        "ko": "이상반응",
        "en": "Adverse Reactions",
        "ja": "有害反応",
    },
    "safety_adverse_val": {
        "ko": "0건",
        "en": "0 cases",
        "ja": "0件",
    },
    "safety_adverse_detail": {
        "ko": "전 제품 전 기간",
        "en": "All products, all periods",
        "ja": "全製品・全期間",
    },
    "safety_irritation": {
        "ko": "자극지수",
        "en": "Irritation Index",
        "ja": "刺激指数",
    },
    "safety_irritation_detail": {
        "ko": "전 제품 비자극성 (0.00~0.25)",
        "en": "All non-irritant (0.00–0.25)",
        "ja": "全製品 非刺激性 (0.00〜0.25)",
    },
    "safety_compliance": {
        "ko": "순응도",
        "en": "Compliance",
        "ja": "順守度",
    },
    "safety_compliance_detail": {
        "ko": "전 시험 평균",
        "en": "Average across all trials",
        "ja": "全試験平均",
    },
    "safety_satisfaction": {
        "ko": "설문 만족도",
        "en": "Satisfaction",
        "ja": "満足度",
    },
    "safety_satisfaction_detail": {
        "ko": "긍정 응답률",
        "en": "Positive response rate",
        "ja": "肯定的回答率",
    },

    # ── 섹션 6: 데이터 출처 ──
    "sec6_title": {
        "ko": "6. 데이터 출처 — 보고서 목록",
        "en": "6. Data Sources — Report List",
        "ja": "6. データ出典 — 報告書一覧",
    },
    "sec6_explain": {
        "ko": """
        <strong>데이터 출처:</strong> 본 대시보드의 모든 수치는 아래 14건의 인체적용시험 결과보고서(휴먼테스트 수행)에서 자동 파싱하여 추출한 것입니다.
        각 보고서의 5장(시험 결과) 요약 테이블에서 Mean±SD, 개선율(%), 대조군 대비 개선율(%), 군간비교 p-value를 추출합니다.
        """,
        "en": """
        <strong>Data source:</strong> All figures in this dashboard are automatically parsed from the 14 human application test result reports listed below.
        Mean±SD, improvement rates (%), comparative improvement (%), and between-group p-values are extracted from Chapter 5 (Results) summary tables of each report.
        """,
        "ja": """
        <strong>データ出典:</strong> 本ダッシュボードの全数値は、以下14件のヒト応用試験結果報告書から自動パースして抽出したものです。
        各報告書の第5章（試験結果）要約テーブルからMean±SD、改善率(%)、対照群比改善率(%)、群間比較p値を抽出しています。
        """,
    },

    # ── 테이블 컬럼명 ──
    "col_report_code": {
        "ko": "보고서 코드",
        "en": "Report Code",
        "ja": "報告書コード",
    },
    "col_product": {
        "ko": "제품",
        "en": "Product",
        "ja": "製品",
    },
    "col_type": {
        "ko": "시험유형",
        "en": "Trial Type",
        "ja": "試験種別",
    },
    "col_title": {
        "ko": "보고서 제목",
        "en": "Report Title",
        "ja": "報告書タイトル",
    },
    "col_duration": {
        "ko": "기간",
        "en": "Duration",
        "ja": "期間",
    },
    "col_subjects": {
        "ko": "피험자(명)",
        "en": "Subjects",
        "ja": "被験者(名)",
    },
    "col_metrics": {
        "ko": "추출 지표",
        "en": "Extracted Metrics",
        "ja": "抽出指標",
    },
    "col_metric": {
        "ko": "지표",
        "en": "Metric",
        "ja": "指標",
    },
    "col_test_impr": {
        "ko": "시험군 개선율(%)",
        "en": "Test Group Improvement (%)",
        "ja": "試験群改善率(%)",
    },
    "col_ctrl_impr": {
        "ko": "대조군 개선율(%)",
        "en": "Control Group Improvement (%)",
        "ja": "対照群改善率(%)",
    },
    "col_comparative": {
        "ko": "대조군 대비(%)",
        "en": "Comparative (%)",
        "ja": "対照群比(%)",
    },
    "col_pvalue": {
        "ko": "군간 p-value",
        "en": "Between-group p-value",
        "ja": "群間 p値",
    },
    "col_test_type": {
        "ko": "시험유형",
        "en": "Test Type",
        "ja": "試験種別",
    },
    "col_irritation": {
        "ko": "자극지수",
        "en": "Irritation Index",
        "ja": "刺激指数",
    },
    "col_verdict": {
        "ko": "판정",
        "en": "Verdict",
        "ja": "判定",
    },
    "col_body_part": {
        "ko": "부위",
        "en": "Body Part",
        "ja": "部位",
    },
    "col_test_pct": {
        "ko": "시험군(%)",
        "en": "Test Group (%)",
        "ja": "試験群(%)",
    },
    "col_ctrl_pct": {
        "ko": "대조군(%)",
        "en": "Control Group (%)",
        "ja": "対照群(%)",
    },

    # ── 시험유형 라벨 ──
    "type_efficacy": {
        "ko": "효능",
        "en": "Efficacy",
        "ja": "効能",
    },
    "type_absorption": {
        "ko": "흡수도",
        "en": "Absorption",
        "ja": "吸収度",
    },
    "type_safety": {
        "ko": "안전성",
        "en": "Safety",
        "ja": "安全性",
    },

    # ── 탭 라벨 ──
    "tab_efficacy": {
        "ko": "📊 효능 비교",
        "en": "📊 Efficacy",
        "ja": "📊 効能比較",
    },
    "tab_absorption": {
        "ko": "💧 흡수도",
        "en": "💧 Absorption",
        "ja": "💧 吸収度",
    },
    "tab_safety": {
        "ko": "🛡️ 안전성",
        "en": "🛡️ Safety",
        "ja": "🛡️ 安全性",
    },

    # ── 설명 토글 라벨 ──
    "sec1_explain_toggle": {
        "ko": "📖 계산 방법 & 해석 가이드",
        "en": "📖 Methodology & Interpretation",
        "ja": "📖 計算方法と解釈ガイド",
    },
    "sec2_explain_toggle": {
        "ko": "📖 이 차트의 의미와 계산 방법",
        "en": "📖 How to read this chart",
        "ja": "📖 このチャートの見方",
    },
    "sec3_explain_toggle": {
        "ko": "📖 히트맵 해석 가이드",
        "en": "📖 How to read this heatmap",
        "ja": "📖 ヒートマップの見方",
    },
    "sec4_explain_toggle": {
        "ko": "📖 흡수도 측정 방법 & 해석",
        "en": "📖 Measurement method & interpretation",
        "ja": "📖 吸収度の測定方法と解釈",
    },
    "sec5_explain_toggle": {
        "ko": "📖 안전성 지표 설명",
        "en": "📖 Safety metric descriptions",
        "ja": "📖 安全性指標の説明",
    },

    # ── 차트 범례 / 축 ──
    "legend_test": {
        "ko": "시험군(제품+패치)",
        "en": "Test (Product+Patch)",
        "ja": "試験群（製品+パッチ）",
    },
    "legend_control": {
        "ko": "대조군(제품 단독)",
        "en": "Control (Product Only)",
        "ja": "対照群（製品のみ）",
    },
    "axis_improvement": {
        "ko": "개선율(%)",
        "en": "Improvement (%)",
        "ja": "改善率(%)",
    },
    # ── 차트 내부 라벨 ──
    "chart_range": {
        "ko": "범위(min~max)",
        "en": "Range (min–max)",
        "ja": "範囲(min〜max)",
    },
    "chart_average": {
        "ko": "평균",
        "en": "Average",
        "ja": "平均",
    },
    "chart_comparative_axis": {
        "ko": "대조군 대비 개선율(%)",
        "en": "Comparative Improvement (%)",
        "ja": "対照群比改善率(%)",
    },
    "chart_colorbar": {
        "ko": "대조군 대비\n개선율(%)",
        "en": "Comparative\nImprovement(%)",
        "ja": "対照群比\n改善率(%)",
    },
}

# ── 지표명 번역 ──
METRIC_NAMES = {
    "보습": {"en": "Moisturizing", "ja": "保湿"},
    "탄력": {"en": "Elasticity", "ja": "弾力"},
    "주름(눈가)": {"en": "Wrinkles (Eye)", "ja": "シワ（目元）"},
    "주름(팔자)": {"en": "Wrinkles (Nasolabial)", "ja": "シワ（ほうれい線）"},
    "주름": {"en": "Wrinkles", "ja": "シワ"},
    "피부결": {"en": "Skin Texture", "ja": "肌キメ"},
    "피부밀도": {"en": "Skin Density", "ja": "肌密度"},
    "모공": {"en": "Pores", "ja": "毛穴"},
    "리프팅": {"en": "Lifting", "ja": "リフティング"},
    "다크서클": {"en": "Dark Circles", "ja": "ダークサークル"},
    "색소": {"en": "Pigmentation", "ja": "色素沈着"},
    "피부 광": {"en": "Skin Glow", "ja": "肌ツヤ"},
    "흡수량": {"en": "Absorption Amount", "ja": "吸収量"},
    "흡수 깊이": {"en": "Absorption Depth", "ja": "吸収深さ"},
    "흡수 속도": {"en": "Absorption Speed", "ja": "吸収速度"},
}

# ── 제품명 번역 ──
PRODUCT_NAMES = {
    "옥타겔": {"en": "OctaGel", "ja": "オクタゲル"},
    "GFC셀 파우더+솔루션": {"en": "GFC Cell Powder+Solution", "ja": "GFCセルパウダー+ソリューション"},
    "GFC셀 파우더+솔루션+MTS": {"en": "GFC Cell Powder+Solution+MTS", "ja": "GFCセルパウダー+ソリューション+MTS"},
    "Stem Science Eye 크림": {"en": "Stem Science Eye Cream", "ja": "Stem Science Eyeクリーム"},
    "Clini Science Eye 크림": {"en": "Clini Science Eye Cream", "ja": "Clini Science Eyeクリーム"},
    "Exo H-Serum": {"en": "Exo H-Serum", "ja": "Exo H-Serum"},
    "뉴라덤 코어타임 앰플": {"en": "Neuraderm CoreTime Ampoule", "ja": "ニューラダーム コアタイム アンプル"},
    "CNP 더마 앤서 앰플": {"en": "CNP Derma Answer Ampoule", "ja": "CNPダーマアンサーアンプル"},
    "성분에디터 앰플+패치": {"en": "Ingredient Editor Ampoule+Patch", "ja": "成分エディターアンプル+パッチ"},
    "성분에디터 앰플+패치A/B": {"en": "Ingredient Editor Ampoule+Patch A/B", "ja": "成分エディターアンプル+パッチA/B"},
    "문어 흡반 구조 모사 피부 패치": {"en": "Octopus Sucker Skin Patch", "ja": "タコ吸盤構造模倣パッチ"},
    "Stem Science Eye+음압패치": {"en": "Stem Science Eye+Cupping Patch", "ja": "Stem Science Eye+陰圧パッチ"},
    "Clini Science Eye+음압패치": {"en": "Clini Science Eye+Cupping Patch", "ja": "Clini Science Eye+陰圧パッチ"},
}

# ── 부위명 번역 ──
BODY_PARTS = {
    "뺨": {"en": "Cheek", "ja": "頬"},
    "전박": {"en": "Forearm", "ja": "前腕"},
    "눈가": {"en": "Eye area", "ja": "目元"},
    "뺨/눈가/팔자": {"en": "Cheek/Eye/Nasolabial", "ja": "頬/目元/ほうれい線"},
    "눈가/눈밑": {"en": "Eye area", "ja": "目元"},
    "눈가/뺨": {"en": "Eye/Cheek", "ja": "目元/頬"},
}

# ── 안전성 판정 번역 ──
SAFETY_RESULTS = {
    "비자극성": {"en": "Non-irritant", "ja": "非刺激性"},
    "자극테스트": {"en": "Irritation Test", "ja": "刺激テスト"},
    "저자극테스트": {"en": "Hypoallergenic Test", "ja": "低刺激テスト"},
}


def t(key, lang="ko", **kwargs):
    """번역 키에 해당하는 텍스트를 반환한다."""
    entry = TRANSLATIONS.get(key, {})
    text = entry.get(lang, entry.get("ko", key))
    if kwargs:
        text = text.format(**kwargs)
    return text


def t_metric(name, lang="ko"):
    """지표명을 번역한다."""
    if lang == "ko":
        return name
    return METRIC_NAMES.get(name, {}).get(lang, name)


def t_product(name, lang="ko"):
    """제품명을 번역한다."""
    if lang == "ko":
        return name
    return PRODUCT_NAMES.get(name, {}).get(lang, name)


def t_body_part(name, lang="ko"):
    """부위명을 번역한다."""
    if lang == "ko":
        return name
    return BODY_PARTS.get(name, {}).get(lang, name)


def t_safety(name, lang="ko"):
    """안전성 관련 용어를 번역한다."""
    if lang == "ko":
        return name
    return SAFETY_RESULTS.get(name, {}).get(lang, name)
