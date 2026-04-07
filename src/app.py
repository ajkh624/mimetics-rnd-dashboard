"""음압패치 효과 검증 대시보드 — Streamlit 메인 앱 (다국어 + UI/UX 개선)."""
import json
import os
import sys

import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import plotly.graph_objects as go

sys.path.insert(0, os.path.dirname(__file__))

from charts import (
    create_kpi_card_data,
    create_heatmap,
    create_comparison_bar_by_metric,
    create_overview_comparative_chart,
    COLOR_BG,
    COLOR_TEXT,
    COLOR_TEST,
    COLOR_CONTROL,
)
from i18n import t, t_metric, t_product, t_body_part, t_safety

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "parsed_data.json")

LANG_OPTIONS = {"한국어": "ko", "English": "en", "日本語": "ja"}

HERO_METRICS = ["탄력", "주름(눈가)", "보습"]


@st.cache_data
def load_data():
    if not os.path.exists(DATA_PATH):
        st.error("parsed_data.json not found. Run parser.py first.")
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def render_custom_css():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;800;900&display=swap');
    .stApp { background-color: #f5f6f8; font-family: 'Noto Sans KR', sans-serif; }
    .section-title {
        font-size: 20px; font-weight: 800; color: #1a1a2e;
        margin: 32px 0 12px; padding-left: 12px;
        border-left: 4px solid #FF6B6B;
    }
    .explain-box {
        background: #f0f4ff; border: 1px solid #d0ddf0; border-radius: 8px;
        padding: 12px 16px; font-size: 13px; color: #3d5a80; line-height: 1.6;
        margin-bottom: 16px;
    }
    .explain-box strong { color: #1d3557; }

    /* 섹션 앵커 오프셋 */
    .section-anchor { scroll-margin-top: 20px; }
    </style>
    """, unsafe_allow_html=True)


def render_hero(data, lang):
    """Hero 영역 — Streamlit 네이티브 컴포넌트 사용."""
    kpi_all = create_kpi_card_data(data, lang)
    kpi_map = {k["metric_ko"]: k for k in kpi_all}

    hero_items = [kpi_map[m] for m in HERO_METRICS if m in kpi_map]

    # 다크 배경 Hero 헤더
    st.markdown(
        f'<div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);'
        f'border-radius:20px;padding:40px 32px 20px;text-align:center;margin-bottom:8px;">'
        f'<div style="font-size:32px;font-weight:900;color:#fff;margin-bottom:6px;">'
        f'{t("hero_title", lang)}</div>'
        f'<div style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:24px;">'
        f'{t("hero_subtitle", lang)}</div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    # Hero 3개 수치 — st.columns 사용
    cols = st.columns(len(hero_items))
    for col, kpi in zip(cols, hero_items):
        val_str = f"+{kpi['max']:.0f}%"
        detail = t("kpi_products_avg", lang, count=kpi["count"], avg=kpi["avg"])
        col.markdown(
            f'<div style="background:#1a1a2e;border-radius:16px;padding:24px 16px;text-align:center;margin-bottom:16px;">'
            f'<div style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:600;'
            f'text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">{kpi["metric"]}</div>'
            f'<div style="font-size:42px;font-weight:900;color:#FF6B6B;line-height:1.1;">{val_str}</div>'
            f'<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:6px;">{detail}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )


def render_sub_kpis(data, lang):
    """나머지 지표를 소형 카드로 표시 — st.columns 사용."""
    kpi_all = create_kpi_card_data(data, lang)
    remaining = [k for k in kpi_all if k["metric_ko"] not in HERO_METRICS]

    if not remaining:
        return

    # 4열 그리드
    cols_per_row = 4
    for i in range(0, len(remaining), cols_per_row):
        cols = st.columns(cols_per_row)
        for j, col in enumerate(cols):
            idx = i + j
            if idx >= len(remaining):
                break
            kpi = remaining[idx]

            sig_html = ""
            if kpi["all_significant"]:
                sig_html = ('<span style="display:inline-block;background:#d4edda;color:#155724;'
                            'padding:1px 6px;border-radius:6px;font-size:10px;font-weight:600;'
                            'margin-top:3px;">p&lt;0.05</span>')

            range_str = f"+{kpi['min']:.0f}~{kpi['max']:.0f}%"
            if kpi["min"] == kpi["max"]:
                range_str = f"+{kpi['min']:.0f}%"

            detail = t("kpi_products_avg", lang, count=kpi["count"], avg=kpi["avg"])

            col.markdown(
                f'<div style="background:#fff;border-radius:12px;padding:16px;text-align:center;'
                f'border:1px solid #e9ecef;box-shadow:0 1px 3px rgba(0,0,0,0.04);">'
                f'<div style="font-size:12px;color:#868e96;font-weight:600;margin-bottom:4px;">{kpi["metric"]}</div>'
                f'<div style="font-size:20px;font-weight:800;color:#e74c3c;">{range_str}</div>'
                f'<div style="font-size:11px;color:#adb5bd;margin-top:2px;">{detail}</div>'
                f'{sig_html}'
                f'</div>',
                unsafe_allow_html=True,
            )

    with st.expander(t("sec1_explain_toggle", lang)):
        st.markdown(f'<div class="explain-box">{t("sec1_explain", lang)}</div>', unsafe_allow_html=True)


def render_efficacy_tab(data, lang):
    """효능 탭."""
    st.markdown(f'<div class="section-title">{t("sec2_title", lang)}</div>', unsafe_allow_html=True)

    all_metrics = set()
    all_reports = {}
    for report in data:
        if report.get("type") != "efficacy":
            continue
        code = report["report_code"]
        all_reports[code] = report.get("product", "")
        for m in report.get("metrics", []):
            all_metrics.add(m.get("metric", ""))

    metric_list = sorted(all_metrics)

    with st.sidebar:
        st.subheader(t("filter_title", lang))
        selected_metric = st.selectbox(
            t("filter_metric", lang),
            [t("filter_all", lang)] + metric_list,
            index=0,
        )

    is_all = selected_metric == t("filter_all", lang)

    if not is_all:
        with st.expander(t("sec2_explain_toggle", lang)):
            st.markdown(f'<div class="explain-box">{t("sec2_explain_detail", lang, metric=selected_metric)}</div>', unsafe_allow_html=True)
        fig = create_comparison_bar_by_metric(data, selected_metric, lang)
        st.plotly_chart(fig, use_container_width=True)
    else:
        with st.expander(t("sec2_explain_toggle", lang)):
            st.markdown(f'<div class="explain-box">{t("sec2_explain_overview", lang)}</div>', unsafe_allow_html=True)
        fig = create_overview_comparative_chart(data, lang)
        st.plotly_chart(fig, use_container_width=True)

    # 히트맵
    st.markdown('<div id="sec-heatmap" class="section-anchor"></div>', unsafe_allow_html=True)
    st.markdown(f'<div class="section-title">{t("sec3_title", lang)}</div>', unsafe_allow_html=True)

    with st.expander(t("sec3_explain_toggle", lang)):
        st.markdown(f'<div class="explain-box">{t("sec3_explain", lang)}</div>', unsafe_allow_html=True)

    fig_hm = create_heatmap(data, lang)
    st.plotly_chart(fig_hm, use_container_width=True)

    with st.expander(t("sec3_expander", lang)):
        rows = []
        for report in data:
            if report.get("type") != "efficacy":
                continue
            for m in report.get("metrics", []):
                comp = m.get("comparative_improvement", [])
                test_vals = m.get("test_improvement", [])
                ctrl_vals = m.get("control_improvement", [])
                bp = m.get("between_group_p", [])
                rows.append({
                    t("col_report_code", lang): report["report_code"],
                    t("col_product", lang): t_product(report.get("product", ""), lang),
                    t("col_duration", lang): report.get("duration", ""),
                    t("col_subjects", lang): report.get("subjects", ""),
                    t("col_metric", lang): t_metric(m.get("metric", ""), lang),
                    t("col_test_impr", lang): test_vals[-1] if test_vals else None,
                    t("col_ctrl_impr", lang): ctrl_vals[-1] if ctrl_vals else None,
                    t("col_comparative", lang): comp[-1] if comp else None,
                    t("col_pvalue", lang): bp[-1] if bp else "",
                })
        if rows:
            st.dataframe(pd.DataFrame(rows), use_container_width=True, height=400)


def render_absorption_tab(data, lang):
    """흡수도 탭."""
    st.markdown(f'<div class="section-title">{t("sec4_title", lang)}</div>', unsafe_allow_html=True)

    with st.expander(t("sec4_explain_toggle", lang)):
        st.markdown(f'<div class="explain-box">{t("sec4_explain", lang)}</div>', unsafe_allow_html=True)

    absorption_reports = [r for r in data if r.get("type") == "absorption"]
    if not absorption_reports:
        return

    rows = []
    for report in absorption_reports:
        product = report.get("product", "")
        body_part = report.get("body_part", "")
        subjects = report.get("subjects", 0)
        code = report["report_code"]
        for m in report.get("metrics", []):
            metric = t_metric(m.get("metric", ""), lang)
            comp = m.get("comparative_improvement", [])
            test_vals = m.get("test_improvement", [])
            ctrl_vals = m.get("control_improvement", [])
            rows.append({
                "code": code,
                "product": t_product(product, lang),
                "body_part": t_body_part(body_part, lang),
                "subjects": subjects, "metric": metric,
                "test": test_vals[0] if test_vals else None,
                "ctrl": ctrl_vals[0] if ctrl_vals else None,
                "comp": comp[0] if comp else None,
            })

    if not rows:
        return

    df = pd.DataFrame(rows)
    pilot_label = t("pilot_label", lang)
    df["label"] = df.apply(
        lambda r: f"[{r['code']}] {r['product']} ({r['body_part']}, n={r['subjects']})"
        + (f" {pilot_label}" if r["subjects"] <= 5 else ""),
        axis=1,
    )

    sub_tabs = st.tabs(sorted(df["metric"].unique()))
    for tab, metric in zip(sub_tabs, sorted(df["metric"].unique())):
        with tab:
            mdf = df[df["metric"] == metric].copy()
            mdf = mdf.sort_values("comp", ascending=True)

            fig = go.Figure()
            fig.add_trace(go.Bar(
                y=mdf["label"], x=mdf["ctrl"], orientation="h",
                name=t("legend_control", lang), marker_color=COLOR_CONTROL,
                text=[f"{v:.0f}%" if v else "-" for v in mdf["ctrl"]], textposition="auto",
            ))
            fig.add_trace(go.Bar(
                y=mdf["label"], x=mdf["test"], orientation="h",
                name=t("legend_test", lang), marker_color=COLOR_TEST,
                text=[f"{v:.0f}%" if v else "-" for v in mdf["test"]], textposition="auto",
            ))
            fig.update_layout(
                barmode="group", plot_bgcolor=COLOR_BG, paper_bgcolor=COLOR_BG,
                font={"color": COLOR_TEXT},
                legend={"orientation": "h", "yanchor": "bottom", "y": 1.02},
                height=max(250, len(mdf) * 70 + 100),
                margin={"l": 380, "r": 40, "t": 40, "b": 40},
                xaxis_title=t("axis_improvement", lang),
            )
            st.plotly_chart(fig, use_container_width=True)

    with st.expander(t("sec4_expander", lang)):
        display_df = df.rename(columns={
            "code": t("col_report_code", lang), "product": t("col_product", lang),
            "body_part": t("col_body_part", lang), "subjects": t("col_subjects", lang),
            "metric": t("col_metric", lang), "test": t("col_test_pct", lang),
            "ctrl": t("col_ctrl_pct", lang), "comp": t("col_comparative", lang),
        })
        show_cols = [c for c in display_df.columns if c != "label"]
        st.dataframe(display_df[show_cols], use_container_width=True, hide_index=True)


def render_safety_tab(data, lang):
    """안전성 탭."""
    st.markdown(f'<div class="section-title">{t("sec5_title", lang)}</div>', unsafe_allow_html=True)

    with st.expander(t("sec5_explain_toggle", lang)):
        st.markdown(f'<div class="explain-box">{t("sec5_explain", lang)}</div>', unsafe_allow_html=True)

    safety_reports = [r for r in data if r.get("type") == "safety"]
    indices = [r["safety_data"]["irritation_index"] for r in safety_reports if r.get("safety_data")]
    idx_str = "~".join(f"{x}" for x in sorted(indices)) if indices else "-"

    # 안전성 카드 — st.columns + 개별 st.markdown
    col1, col2, col3, col4 = st.columns(4)
    cards = [
        (col1, t("safety_adverse", lang), t("safety_adverse_val", lang), t("safety_adverse_detail", lang)),
        (col2, t("safety_irritation", lang), idx_str, t("safety_irritation_detail", lang)),
        (col3, t("safety_compliance", lang), "99.3~100%", t("safety_compliance_detail", lang)),
        (col4, t("safety_satisfaction", lang), "85~100%", t("safety_satisfaction_detail", lang)),
    ]
    for col, label, value, detail in cards:
        with col:
            st.markdown(
                f'<div style="background:#f0fff4;border-radius:12px;padding:20px;'
                f'text-align:center;border:1px solid #c3e6cb;">'
                f'<div style="font-size:12px;color:#555;font-weight:600;margin-bottom:4px;">{label}</div>'
                f'<div style="font-size:24px;font-weight:800;color:#27ae60;">{value}</div>'
                f'<div style="font-size:11px;color:#888;margin-top:4px;">{detail}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )

    if safety_reports:
        st.markdown("")
        rows = []
        for r in safety_reports:
            sd = r.get("safety_data", {})
            rows.append({
                t("col_report_code", lang): r["report_code"],
                t("col_product", lang): t_product(sd.get("product", ""), lang),
                t("col_test_type", lang): t_safety(sd.get("title", ""), lang),
                t("col_irritation", lang): sd.get("irritation_index", ""),
                t("col_verdict", lang): t_safety(sd.get("result", ""), lang),
            })
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def render_data_sources(data, lang):
    """데이터 출처 — 기본 접힌 상태."""
    with st.expander(t("sec6_title", lang)):
        st.markdown(f'<div class="explain-box">{t("sec6_explain", lang)}</div>', unsafe_allow_html=True)

        type_map = {
            "efficacy": t("type_efficacy", lang),
            "absorption": t("type_absorption", lang),
            "safety": t("type_safety", lang),
        }
        rows = []
        for report in data:
            code = report["report_code"]
            rtype = report.get("type", "")
            metric_names = []
            if rtype == "safety":
                metric_names = [f"{t('col_irritation', lang)} {report.get('irritation_index', '')}"]
            else:
                for m in report.get("metrics", []):
                    metric_names.append(t_metric(m.get("metric", ""), lang))
            rows.append({
                t("col_report_code", lang): code,
                t("col_type", lang): type_map.get(rtype, rtype),
                t("col_product", lang): t_product(report.get("product", ""), lang),
                t("col_title", lang): report.get("title", ""),
                t("col_duration", lang): report.get("duration", "-"),
                t("col_subjects", lang): report.get("subjects", "-"),
                t("col_metrics", lang): ", ".join(metric_names) if metric_names else "-",
            })
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True, height=530)


def main():
    st.set_page_config(
        page_title="Cupping Patch Dashboard",
        page_icon="🔬",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    render_custom_css()

    # 언어 선택 — 오른쪽 상단
    top_cols = st.columns([7, 2])
    with top_cols[1]:
        lang_label = st.selectbox(
            "🌐", options=list(LANG_OPTIONS.keys()), index=0,
            label_visibility="collapsed",
        )
    lang = LANG_OPTIONS[lang_label]

    data = load_data()
    if not data:
        return

    # Hero + 서브 KPI
    render_hero(data, lang)
    render_sub_kpis(data, lang)

    # 네비게이션 바 — 클릭 시 해당 섹션으로 스크롤
    nav_items = [
        ("sec-efficacy", t("tab_efficacy", lang)),
        ("sec-heatmap", t("sec3_title", lang).split(". ", 1)[-1] if ". " in t("sec3_title", lang) else "Heatmap"),
        ("sec-absorption", t("tab_absorption", lang)),
        ("sec-safety", t("tab_safety", lang)),
        ("sec-sources", t("sec6_title", lang).split(". ", 1)[-1] if ". " in t("sec6_title", lang) else "Sources"),
    ]
    # components.html()로 렌더링해야 onclick이 동작함 (st.markdown은 JS 차단)
    btns_html = ""
    for anchor, label in nav_items:
        btns_html += f'<a class="nav-btn" data-target="{anchor}">{label}</a>\n'

    components.html(f"""
    <style>
    body {{ margin: 0; padding: 0; font-family: 'Noto Sans KR', sans-serif; background: transparent; }}
    .nav-bar {{
        display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
        padding: 10px 0;
    }}
    .nav-btn {{
        display: inline-block; padding: 8px 20px; border-radius: 20px;
        font-size: 14px; font-weight: 600; text-decoration: none;
        color: #495057; background: #fff; border: 1px solid #dee2e6;
        cursor: pointer; transition: all 0.15s;
    }}
    .nav-btn:hover {{ background: #FF6B6B; color: #fff; border-color: #FF6B6B; }}
    </style>
    <div class="nav-bar">{btns_html}</div>
    <script>
    document.querySelectorAll('.nav-btn').forEach(function(btn) {{
        btn.addEventListener('click', function() {{
            var targetId = this.getAttribute('data-target');
            // Streamlit iframe 바깥의 부모 문서에서 앵커를 찾아 스크롤
            var parent = window.parent.document;
            var el = parent.getElementById(targetId);
            if (!el) return;
            var sc = parent.querySelector('.stMain')
                  || parent.querySelector('section.main')
                  || parent.querySelector('[data-testid="stAppViewContainer"]');
            if (sc) {{
                var rect = el.getBoundingClientRect();
                sc.scrollTo({{ top: sc.scrollTop + rect.top - 80, behavior: 'smooth' }});
            }}
        }});
    }});
    </script>
    """, height=60)

    # 모든 섹션을 한 페이지에 순차 렌더링
    st.markdown('<div id="sec-efficacy" class="section-anchor"></div>', unsafe_allow_html=True)
    render_efficacy_tab(data, lang)

    st.markdown('<div id="sec-absorption" class="section-anchor"></div>', unsafe_allow_html=True)
    render_absorption_tab(data, lang)

    st.markdown('<div id="sec-safety" class="section-anchor"></div>', unsafe_allow_html=True)
    render_safety_tab(data, lang)

    st.markdown('<div id="sec-sources" class="section-anchor"></div>', unsafe_allow_html=True)
    render_data_sources(data, lang)


if __name__ == "__main__":
    main()
