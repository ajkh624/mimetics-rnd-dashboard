"""Plotly 차트 생성 함수 (다국어 지원)."""
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import streamlit as st

from i18n import t, t_metric, t_product


def _is_mobile():
    """Streamlit 뷰포트가 모바일 수준(< 768px)인지 감지."""
    try:
        ctx = st.context
        if hasattr(ctx, "headers"):
            ua = ctx.headers.get("User-Agent", "")
            return any(k in ua.lower() for k in ("mobile", "android", "iphone"))
    except Exception:
        pass
    return False


def _responsive_margin(desktop_left=280):
    """모바일이면 좌측 마진을 축소한다."""
    if _is_mobile():
        return {"l": 20, "r": 16, "t": 40, "b": 40}
    return {"l": desktop_left, "r": 40, "t": 40, "b": 40}

COLOR_TEST = "#e74c3c"
COLOR_CONTROL = "#2ecc71"
COLOR_COMPARATIVE = "#f39c12"
COLOR_BG = "#ffffff"
COLOR_CARD = "#f8f9fa"
COLOR_TEXT = "#212529"


def create_kpi_card_data(parsed_data, lang="ko"):
    """Hero KPI 카드용 데이터를 생성한다."""
    metric_ranges = {}

    for report in parsed_data:
        if report.get("type") != "efficacy":
            continue
        for m in report.get("metrics", []):
            metric = m.get("metric", "")
            comp = m.get("comparative_improvement", [])
            if not comp:
                continue

            if metric not in metric_ranges:
                metric_ranges[metric] = {
                    "values": [],
                    "reports": [],
                    "p_significant": [],
                }

            for val in comp:
                metric_ranges[metric]["values"].append(val)
                metric_ranges[metric]["reports"].append(report["report_code"])

            bp = m.get("between_group_p", [])
            for p in bp:
                is_sig = "<" in str(p) or (isinstance(p, (int, float)) and p < 0.05)
                metric_ranges[metric]["p_significant"].append(is_sig)

    kpi_cards = []
    for metric, data in metric_ranges.items():
        vals = data["values"]
        if not vals:
            continue
        kpi_cards.append({
            "metric": t_metric(metric, lang),
            "metric_ko": metric,
            "min": min(vals),
            "max": max(vals),
            "avg": sum(vals) / len(vals),
            "count": len(set(data["reports"])),
            "all_significant": all(data["p_significant"]) if data["p_significant"] else False,
        })

    kpi_cards.sort(key=lambda x: x["avg"], reverse=True)
    return kpi_cards


def create_heatmap(parsed_data, lang="ko"):
    """제품×지표 히트맵."""
    rows = []

    for report in parsed_data:
        if report.get("type") != "efficacy":
            continue
        product = t_product(report.get("product", ""), lang)
        code = report["report_code"]

        for m in report.get("metrics", []):
            metric = t_metric(m.get("metric", ""), lang)
            comp = m.get("comparative_improvement", [])
            if not comp:
                continue

            rows.append({
                "product": f"[{code}] {product}",
                "metric": metric,
                "value": comp[-1],
            })

    if not rows:
        return go.Figure()

    df = pd.DataFrame(rows)

    pivot = df.pivot_table(
        index="product",
        columns="metric",
        values="value",
        aggfunc="max",
    )

    # 지표 순서 (번역된 이름)
    metric_order_ko = [
        "보습", "탄력", "주름(눈가)", "주름(팔자)", "주름",
        "피부결", "피부밀도", "모공", "리프팅",
        "다크서클", "색소", "피부 광",
    ]
    metric_order = [t_metric(m, lang) for m in metric_order_ko]
    ordered_cols = [c for c in metric_order if c in pivot.columns]
    remaining = [c for c in pivot.columns if c not in ordered_cols]
    pivot = pivot[ordered_cols + remaining]

    colorbar_title = t("chart_colorbar", lang)

    fig = go.Figure(data=go.Heatmap(
        z=pivot.values,
        x=pivot.columns.tolist(),
        y=pivot.index.tolist(),
        colorscale=[
            [0.0, "#FFF3E0"],
            [0.3, "#FFB74D"],
            [0.6, "#FF7043"],
            [1.0, "#D32F2F"],
        ],
        text=[[f"{v:.0f}%" if pd.notna(v) else "-" for v in row] for row in pivot.values],
        texttemplate="%{text}",
        textfont={"size": 12},
        hoverongaps=False,
        hovertemplate="%{y}<br>%{x}: %{z:.1f}%<extra></extra>",
        colorbar={"title": colorbar_title},
    ))

    mobile = _is_mobile()
    fig.update_layout(
        plot_bgcolor=COLOR_BG,
        paper_bgcolor=COLOR_BG,
        font={"color": COLOR_TEXT, "family": "Noto Sans KR, sans-serif",
              "size": 10 if mobile else 12},
        height=max(300, len(pivot.index) * 50 + 100),
        margin=_responsive_margin(280),
        xaxis={"side": "bottom", "tickangle": -45 if mobile else 0},
        yaxis={"autorange": "reversed"},
    )

    return fig


def create_comparison_bar_by_metric(parsed_data, metric_name, lang="ko"):
    """특정 지표의 제품별 시험군/대조군 비교 차트."""
    rows = []

    for report in parsed_data:
        if report.get("type") != "efficacy":
            continue

        for m in report.get("metrics", []):
            if m.get("metric") != metric_name:
                continue

            product = t_product(report.get("product", ""), lang)
            test_vals = m.get("test_improvement", [])
            ctrl_vals = m.get("control_improvement", [])
            comp_vals = m.get("comparative_improvement", [])

            rows.append({
                "product": f"[{report['report_code']}] {product}",
                "test": test_vals[-1] if test_vals else 0,
                "ctrl": ctrl_vals[-1] if ctrl_vals else 0,
                "comp": comp_vals[-1] if comp_vals else 0,
            })

    if not rows:
        return go.Figure()

    df = pd.DataFrame(rows)
    df = df.sort_values("comp", ascending=True)

    fig = go.Figure()

    fig.add_trace(go.Bar(
        name=t("legend_control", lang),
        y=df["product"],
        x=df["ctrl"],
        orientation="h",
        marker_color=COLOR_CONTROL,
        text=[f"{v:.1f}%" for v in df["ctrl"]],
        textposition="auto",
    ))

    fig.add_trace(go.Bar(
        name=t("legend_test", lang),
        y=df["product"],
        x=df["test"],
        orientation="h",
        marker_color=COLOR_TEST,
        text=[f"{v:.1f}%" for v in df["test"]],
        textposition="auto",
    ))

    fig.update_layout(
        barmode="group",
        plot_bgcolor=COLOR_BG,
        paper_bgcolor=COLOR_BG,
        font={"color": COLOR_TEXT, "family": "Noto Sans KR, sans-serif"},
        legend={"orientation": "h", "yanchor": "bottom", "y": 1.02},
        height=max(300, len(df) * 60 + 100),
        margin=_responsive_margin(300),
        xaxis_title=t("axis_improvement", lang),
    )

    return fig


def create_overview_comparative_chart(parsed_data, lang="ko"):
    """전체 지표별 대조군 대비 개선율 범위 요약 차트."""
    rows = []

    for report in parsed_data:
        if report.get("type") != "efficacy":
            continue
        for m in report.get("metrics", []):
            comp = m.get("comparative_improvement", [])
            if not comp:
                continue
            rows.append({
                "metric": t_metric(m["metric"], lang),
                "value": comp[-1],
            })

    if not rows:
        return go.Figure()

    df = pd.DataFrame(rows)

    summary = df.groupby("metric")["value"].agg(["mean", "min", "max", "count"]).reset_index()
    summary = summary.sort_values("mean", ascending=True)

    fig = go.Figure()

    fig.add_trace(go.Bar(
        y=summary["metric"],
        x=summary["max"] - summary["min"],
        base=summary["min"],
        orientation="h",
        marker_color="rgba(231, 76, 60, 0.25)",
        name=t("chart_range", lang),
        hovertemplate="%{y}: %{base:.0f}–%{x:.0f}%<extra></extra>",
    ))

    fig.add_trace(go.Scatter(
        y=summary["metric"],
        x=summary["mean"],
        mode="markers+text",
        marker={"size": 14, "color": COLOR_TEST, "symbol": "diamond"},
        text=[f"{v:.0f}%" for v in summary["mean"]],
        textposition="middle right",
        textfont={"size": 12, "color": COLOR_TEXT},
        name=t("chart_average", lang),
        hovertemplate="%{y}: %{x:.1f}%<extra></extra>",
    ))

    fig.update_layout(
        plot_bgcolor=COLOR_BG,
        paper_bgcolor=COLOR_BG,
        font={"color": COLOR_TEXT, "family": "Noto Sans KR, sans-serif"},
        legend={"orientation": "h", "yanchor": "bottom", "y": 1.02},
        height=max(350, len(summary) * 40 + 100),
        margin=_responsive_margin(160),
        xaxis_title=t("chart_comparative_axis", lang),
        showlegend=True,
    )

    return fig
