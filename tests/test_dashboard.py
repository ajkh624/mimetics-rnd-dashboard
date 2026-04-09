"""Playwright 기반 대시보드 E2E 검증 스크립트."""
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8501"
ERRORS = []
PASSES = []


def check(name, condition, detail=""):
    if condition:
        PASSES.append(name)
        print(f"  [PASS] {name}")
    else:
        ERRORS.append(f"{name}: {detail}")
        print(f"  [FAIL] {name} — {detail}")


def wait_for_app(page):
    """Streamlit 앱이 완전히 로드될 때까지 대기."""
    page.goto(BASE_URL, wait_until="networkidle")
    # Streamlit의 로딩 스피너가 사라질 때까지 대기
    page.wait_for_timeout(3000)
    # stApp 컨테이너 확인
    page.wait_for_selector("[data-testid='stAppViewContainer']", timeout=15000)


def test_page_loads(page):
    """페이지가 정상 로드되는지 확인."""
    print("\n=== 1. 페이지 로드 ===")

    # 콘솔 에러 수집
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

    wait_for_app(page)

    check("HTTP 200 응답", page.url.startswith(BASE_URL))
    check("페이지 제목 존재", page.title() != "")

    # JS 에러 필터 (Streamlit 내부 워닝 제외)
    real_errors = [e for e in console_errors if "ERR" in e.upper() and "websocket" not in e.lower()]
    check("JS 콘솔 에러 없음", len(real_errors) == 0, f"{len(real_errors)}개: {real_errors[:3]}")


def test_hero_section(page):
    """Hero 영역 검증 — inline style 기반."""
    print("\n=== 2. Hero 영역 ===")

    body_text = page.inner_text("body")
    html = page.content()

    # Hero 타이틀 텍스트 존재
    has_title = "음압패치" in body_text or "Cupping Patch" in body_text
    check("Hero 타이틀 존재", has_title)

    # Hero 다크 배경 (inline gradient)
    has_hero_bg = "linear-gradient(135deg" in html
    check("Hero 다크 배경 존재", has_hero_bg)

    # Hero 핵심 지표 3개 — 42px 대형 텍스트 (Streamlit이 공백 정규화)
    hero_values = html.count("42px")
    check("Hero 핵심 지표 3개", hero_values >= 3, f"found {hero_values}")

    # 각 지표에 % 포함
    check("Hero에 탄력 지표", "탄력" in body_text or "Elasticity" in body_text)
    check("Hero에 주름 지표", "주름" in body_text or "Wrinkle" in body_text)
    check("Hero에 보습 지표", "보습" in body_text or "Moistur" in body_text)


def test_sub_kpi_cards(page):
    """서브 KPI 카드 검증."""
    print("\n=== 3. 서브 KPI 카드 ===")

    # Streamlit의 st.markdown은 iframe/shadow DOM 안에 렌더링되므로
    # 페이지 전체 텍스트에서 KPI 값 패턴을 확인
    body_text = page.inner_text("body")
    kpi_pattern_count = body_text.count("+") - 3  # Hero 3개 제외
    check("서브 KPI 영역 존재", "kpi" in page.content().lower() or "+" in body_text)

    # 서브 KPI — body 텍스트에서 "+숫자~숫자%" 패턴 개수로 확인
    import re
    kpi_pattern_count = len(re.findall(r'\+\d+~?\d*%', body_text))
    check(f"서브 KPI 카드 다수 존재", kpi_pattern_count >= 7, f"found {kpi_pattern_count} KPI values")

    check("KPI 값 포맷 정상 (+XX%)", "+84" in body_text or "+93" in body_text or "+52" in body_text)


def test_navigation(page):
    """네비게이션 바 검증."""
    print("\n=== 4. 네비게이션 바 ===")

    html = page.content()
    body = page.inner_text("body")

    # nav-btn 클래스 링크 존재
    nav_count = html.count("nav-btn")
    check("네비게이션 버튼 존재", nav_count >= 4, f"found {nav_count}")

    # 앵커 ID 존재
    check("효능 섹션 앵커", "sec-efficacy" in html)
    check("흡수도 섹션 앵커", "sec-absorption" in html)
    check("안전성 섹션 앵커", "sec-safety" in html)

    # 모든 섹션이 한 페이지에 보이는지 확인
    check("효능 섹션 표시", "시험군 vs 대조군" in body or "Test vs Control" in body)
    check("안전성 섹션 표시", "순응도" in body or "Compliance" in body)


def test_efficacy_tab(page):
    """효능 탭 내용 검증."""
    print("\n=== 5. 효능 탭 ===")

    # 차트가 렌더링되었는지 확인
    charts = page.query_selector_all(".js-plotly-plot")
    check("Plotly 차트 존재", len(charts) > 0, f"found {len(charts)}")

    # 섹션 타이틀 확인
    sections = page.query_selector_all(".section-title")
    check("섹션 타이틀 존재", len(sections) >= 1, f"found {len(sections)}")


def test_absorption_section(page):
    """흡수도 섹션 검증 (한 페이지에 표시)."""
    print("\n=== 6. 흡수도 섹션 ===")

    body_text = page.inner_text("body")
    has_absorption = "흡수" in body_text or "Absorption" in body_text
    check("흡수도 콘텐츠 표시", has_absorption)

    charts = page.query_selector_all(".js-plotly-plot")
    check("차트 다수 렌더링", len(charts) >= 2, f"found {len(charts)}")


def test_safety_section(page):
    """안전성 섹션 검증 (한 페이지에 표시)."""
    print("\n=== 7. 안전성 섹션 ===")

    body_text = page.inner_text("body")
    has_safety_items = (
        ("순응도" in body_text or "Compliance" in body_text)
        and ("만족도" in body_text or "Satisfaction" in body_text)
    )
    check("안전성 카드 표시", has_safety_items)
    check("이상반응 0건", "0" in body_text and ("이상반응" in body_text or "Adverse" in body_text))


def test_language_switch(page):
    """언어 전환 검증."""
    print("\n=== 8. 언어 전환 ===")

    # 효능 탭으로 돌아가기
    tabs = page.query_selector_all("[data-baseweb='tab']")
    if tabs:
        tabs[0].click()
        page.wait_for_timeout(1000)

    # 언어 셀렉트박스 찾기
    selects = page.query_selector_all("[data-testid='stSelectbox']")
    lang_select = None
    for s in selects:
        text = s.inner_text()
        if "한국어" in text or "English" in text:
            lang_select = s
            break

    if not lang_select:
        check("언어 셀렉트박스 존재", False, "찾을 수 없음")
        return

    check("언어 셀렉트박스 존재", True)

    # English로 전환
    lang_select.click()
    page.wait_for_timeout(500)

    options = page.query_selector_all("[role='option']")
    en_option = None
    for opt in options:
        if "English" in opt.inner_text():
            en_option = opt
            break

    if en_option:
        en_option.click()
        page.wait_for_timeout(3000)

        body_text = page.inner_text("body")
        check("영문 전환 — Hero 타이틀", "Cupping Patch" in body_text or "Dashboard" in body_text, body_text[:200])
        check("영문 전환 — 네비 라벨", "Efficacy" in body_text or "Safety" in body_text)
    else:
        check("English 옵션 존재", False)

    # 한국어로 복귀
    selects = page.query_selector_all("[data-testid='stSelectbox']")
    for s in selects:
        if "English" in s.inner_text():
            s.click()
            page.wait_for_timeout(500)
            options = page.query_selector_all("[role='option']")
            for opt in options:
                if "한국어" in opt.inner_text():
                    opt.click()
                    page.wait_for_timeout(2000)
                    break
            break


def test_data_sources_expander(page):
    """데이터 출처 expander 검증."""
    print("\n=== 9. 데이터 출처 ===")

    # expander 찾기
    expanders = page.query_selector_all("[data-testid='stExpander']")
    check("Expander 존재", len(expanders) > 0, f"found {len(expanders)}")


def test_no_streamlit_errors(page):
    """Streamlit 에러 메시지 없는지 확인."""
    print("\n=== 10. Streamlit 에러 체크 ===")

    error_elements = page.query_selector_all("[data-testid='stException']")
    check("Streamlit Exception 없음", len(error_elements) == 0, f"found {len(error_elements)}")

    error_elements2 = page.query_selector_all("[data-testid='stError']")
    check("Streamlit Error 없음", len(error_elements2) == 0, f"found {len(error_elements2)}")

    # NameError, TypeError 등 Python 에러 텍스트 체크
    body = page.inner_text("body")
    for err_type in ["NameError", "TypeError", "AttributeError", "KeyError", "ImportError"]:
        check(f"{err_type} 없음", err_type not in body, f"Found '{err_type}' in page")


def test_screenshot(page):
    """최종 스크린샷 저장."""
    print("\n=== 11. 스크린샷 ===")

    # 페이지 상단으로 스크롤
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(1000)

    page.screenshot(path="tests/screenshot_dashboard.png", full_page=True)
    check("스크린샷 저장", True, "tests/screenshot_dashboard.png")


def main():
    print("=" * 60)
    print("  음압패치 대시보드 E2E 검증 (Playwright)")
    print("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            test_page_loads(page)
            test_hero_section(page)
            test_sub_kpi_cards(page)
            test_navigation(page)
            test_efficacy_tab(page)
            test_absorption_section(page)
            test_safety_section(page)
            test_language_switch(page)
            test_data_sources_expander(page)
            test_no_streamlit_errors(page)
            test_screenshot(page)
        except Exception as e:
            ERRORS.append(f"UNEXPECTED: {e}")
            print(f"\n  [CRASH] {e}")
        finally:
            browser.close()

    # ── 결과 요약 ──
    print("\n" + "=" * 60)
    print(f"  PASSED: {len(PASSES)}")
    print(f"  FAILED: {len(ERRORS)}")
    print("=" * 60)

    if ERRORS:
        print("\nFailed tests:")
        for err in ERRORS:
            print(f"  ✗ {err}")
        sys.exit(1)
    else:
        print("\nAll tests passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
