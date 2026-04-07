"""PDF 파싱 엔진 — 14개 임상시험 보고서에서 요약 테이블 데이터 추출.

PDF 텍스트에서 라벨과 값이 별도 줄에 있으므로 상태 기반 파싱을 사용한다.
"""
import sys
import io
import os
import re
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

import fitz

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "parsed_data.json")

REPORT_META = {
    "HR-P25-0036": {
        "type": "absorption",
        "product": "옥타겔",
        "duration": "1회",
        "subjects": 3,
        "title": "피부 흡수도 비교(예비시험)",
        "body_part": "전박",
    },
    "HM-R25-1063": {
        "type": "efficacy",
        "product": "옥타겔",
        "duration": "2주",
        "subjects": 20,
        "title": "24시간 보습 유지 효과 외",
        "body_part": "뺨/눈가/팔자",
    },
    "HM-R25-1123": {
        "type": "efficacy",
        "product": "GFC셀 파우더+솔루션",
        "duration": "4주",
        "subjects": 23,
        "title": "눈가 주름 개선 외(대조군2,1)",
        "body_part": "눈가",
        "group_labels": {"test": "대조군2", "control": "대조군1"},
    },
    "HM-R25-1124": {
        "type": "efficacy",
        "product": "GFC셀 파우더+솔루션+MTS",
        "duration": "4주",
        "subjects": 24,
        "title": "눈가주름 개선 외(대조군3,시험군1)",
        "body_part": "눈가",
        "group_labels": {"test": "시험군1", "control": "대조군3"},
    },
    "HM-R25-1129": {
        "type": "efficacy",
        "product": "Stem Science Eye 크림",
        "duration": "4주",
        "subjects": 21,
        "title": "눈가 주름 개선 외(Stem)",
        "body_part": "눈가/눈밑",
    },
    "HM-R25-1130": {
        "type": "efficacy",
        "product": "Clini Science Eye 크림",
        "duration": "4주",
        "subjects": 21,
        "title": "눈가 주름 개선 외(Clini)",
        "body_part": "눈가/눈밑",
    },
    "HM-R26-0077": {
        "type": "efficacy",
        "product": "Exo H-Serum",
        "duration": "2주",
        "subjects": 20,
        "title": "눈가 주름 외",
        "body_part": "눈가/뺨",
    },
    "HM-R25-0666": {
        "type": "efficacy",
        "product": "뉴라덤 코어타임 앰플",
        "duration": "2주(+4주 색소)",
        "subjects": 20,
        "title": "피부 주름 개선 외",
        "body_part": "눈가/뺨",
    },
    "HD-R24-0043": {
        "type": "efficacy",
        "product": "CNP 더마 앤서 앰플",
        "duration": "2주(+4주 색소)",
        "subjects": 10,
        "title": "피부 주름 개선 외(영문)",
        "body_part": "눈가/뺨",
        "lang": "en",
    },
    "HE-R24-240219-1": {
        "type": "absorption",
        "product": "성분에디터 앰플+패치",
        "duration": "1회",
        "subjects": 20,
        "title": "피부 흡수도 시험(뺨)",
        "body_part": "뺨",
    },
    "HE-R24-240219-2": {
        "type": "absorption",
        "product": "성분에디터 앰플+패치A/B",
        "duration": "1회",
        "subjects": 5,
        "title": "피부 흡수도 시험",
        "body_part": "전박",
    },
    "HM-0032-21": {
        "type": "safety",
        "product": "문어 흡반 구조 모사 피부 패치",
        "title": "자극테스트",
        "irritation_index": 0.07,
        "result": "비자극성",
    },
    "HM-0086-01": {
        "type": "safety",
        "product": "Stem Science Eye+음압패치",
        "title": "저자극테스트",
        "irritation_index": 0.18,
        "result": "비자극성",
    },
    "HM-0086-02": {
        "type": "safety",
        "product": "Clini Science Eye+음압패치",
        "title": "저자극테스트",
        "irritation_index": 0.17,
        "result": "비자극성",
    },
}

# 지표명 키워드 매핑 (우선순위 높은 것 먼저)
METRIC_KEYWORDS_KO = [
    ("산술평균거칠기", "피부결"),
    ("거칠기", "피부결"),
    ("피부 결", "피부결"),
    ("치밀도", "피부밀도"),
    ("Density", "피부밀도"),
    ("밀도", "피부밀도"),
    ("모공", "모공"),
    ("pore", "모공"),
    ("처짐 각도", "리프팅"),
    ("리프팅", "리프팅"),
    ("처짐 면적", "리프팅"),
    ("유전율", "보습"),
    ("보습", "보습"),
    ("CoR", "탄력"),
    ("R2(mm)", "탄력"),
    ("R2(㎜)", "탄력"),
    ("R2 평가", "탄력"),
    ("탄력", "탄력"),
    ("Average depth", "주름"),
    ("주름 평균 깊이", "주름"),
    ("주름", "주름"),
    ("피부색 밝기", "다크서클"),
    ("밝기", "다크서클"),
    ("L*", "다크서클"),
    ("다크서클", "다크서클"),
    ("Melanin", "색소"),
    ("melanin", "색소"),
    ("색소", "색소"),
    ("피부 윤기", "피부 광"),
    ("윤기", "피부 광"),
    ("피부 광", "피부 광"),
    ("피부광", "피부 광"),
    ("흡수량", "흡수량"),
    ("흡수 깊이", "흡수 깊이"),
    ("흡수 속도", "흡수 속도"),
]

METRIC_KEYWORDS_EN = [
    ("wrinkle", "주름(눈가)"),
    ("elasticity", "탄력"),
    ("dielectric", "보습"),
    ("moisturization", "보습"),
    ("melanin", "색소"),
    ("pigmentation", "색소"),
]


def find_pdf_for_code(report_code):
    """보고서 코드에 해당하는 PDF 파일 경로를 찾는다."""
    for fname in os.listdir(DATA_DIR):
        if fname.endswith(".pdf") and report_code in fname:
            return os.path.join(DATA_DIR, fname)
    return None


def extract_full_text(pdf_path):
    """PDF 전체 텍스트를 페이지별로 추출한다."""
    doc = fitz.open(pdf_path)
    pages = [doc[i].get_text() for i in range(doc.page_count)]
    doc.close()
    return pages


def extract_chapter5_text(pages, lang="ko"):
    """5장(시험 결과) 텍스트만 추출한다.

    목차 페이지를 건너뛰고 실제 본문의 5장을 찾는다.
    """
    ch5_start = None
    ch5_end = None

    for i, text in enumerate(pages):
        # 목차/요약 페이지 건너뛰기
        if "목 차" in text or "목차" in text[:100]:
            continue
        if "요약문" in text[:200]:
            continue

        if ch5_start is None:
            if lang == "en":
                # "5. " 로 시작하는 줄이 있고, 실제 본문인지 확인
                if re.search(r"^5\.\s", text, re.MULTILINE) and "Table" in text:
                    ch5_start = i
                elif re.search(r"^5\.\d", text, re.MULTILINE) and "Table" in text:
                    ch5_start = i
            else:
                # "5. 시험 결과" 또는 "5.\n시험" 패턴이 줄 시작에 있어야 함
                if re.search(r"^5\.\s*(시험\s*결과)", text, re.MULTILINE):
                    ch5_start = i
                elif re.search(r"^5\.\s*$", text, re.MULTILINE) and "Table" in text:
                    ch5_start = i
        elif ch5_end is None:
            if lang == "en":
                if re.search(r"^6\.\s", text, re.MULTILINE) or "Appendix" in text:
                    ch5_end = i
                    break
            else:
                if re.search(r"^6\.\s", text, re.MULTILINE) and "결론" in text:
                    ch5_end = i
                    break
                if "별첨" in text[:200]:
                    ch5_end = i
                    break

    if ch5_start is None:
        ch5_start = 0
    if ch5_end is None:
        ch5_end = len(pages)

    return "\n".join(pages[ch5_start:ch5_end])


def identify_metric(text, lang="ko"):
    """텍스트에서 평가 지표명을 식별한다."""
    keywords = METRIC_KEYWORDS_EN if lang == "en" else METRIC_KEYWORDS_KO
    text_lower = text if lang == "ko" else text.lower()

    for keyword, metric in keywords:
        check = keyword if lang == "ko" else keyword.lower()
        if check in text_lower:
            if metric == "주름" and lang == "ko":
                if "눈가" in text and "팔자" not in text:
                    return "주름(눈가)"
                elif "팔자" in text and "눈가" not in text:
                    return "주름(팔자)"
                elif "눈가" in text and "팔자" in text:
                    # 복합 테이블 — 2개로 분리해야 함
                    return "주름(눈가+팔자)"
                return "주름"
            return metric
    return None


def parse_table_block(lines):
    """테이블 텍스트 블록에서 데이터를 상태 기반으로 추출한다.

    PDF 텍스트에서 "대조군\\n대비 개선율" 같이 키워드가 줄 분리되므로,
    인접 줄을 합쳐서 상태를 판단한다.
    """
    mean_sd_values = []
    within_p_values = []
    between_p_values = []
    improvement_pcts = []
    comparative_pcts = []

    # 줄 전처리: 인접 줄을 합쳐서 키워드 분리 문제 해결
    joined = _join_fragmented_lines(lines)

    state = "data"
    pct_pattern = re.compile(r"^(\d+\.?\d*)\s*%\s*$")
    pvalue_pattern = re.compile(r"^([<>]?\s*0\.\d+|<\s*0\.001)\s*$")

    for s in joined:
        if not s:
            continue

        # 상태 전환 감지 (합쳐진 줄에서)
        # "대조군 대비", "대조군1 대비 대조군2", "시험군1 대비 대조군3" 등
        if re.search(r"대비\s*(대조군|시험군|개선율)", s) or "대조군 대비" in s or "대조군1 대비" in s:
            state = "comparative"
            continue
        if re.match(r"^개선율\s*$", s) or s == "개선율":
            if state != "comparative":
                state = "improvement"
            continue
        if "군간비교" in s:
            state = "between_p"
            continue
        if "군내비교" in s:
            state = "within_p"
            continue

        # 시점 설명줄 건너뛰기
        if "대비" in s and ("사용" in s or "주" in s):
            continue
        if re.match(r"^Before\s*-?\s*After", s, re.IGNORECASE):
            continue

        # 퍼센트 값 수집
        pct_match = pct_pattern.match(s)
        if pct_match:
            val = float(pct_match.group(1))
            if state == "comparative":
                comparative_pcts.append(val)
            elif state == "improvement":
                improvement_pcts.append(val)
            continue

        # p-value 수집
        pv_match = pvalue_pattern.match(s)
        if pv_match:
            pv = pv_match.group(1).strip()
            if state == "between_p":
                between_p_values.append(pv)
            elif state == "within_p":
                within_p_values.append(pv)
            continue

        # Mean±SD 수집
        mean_sd_match = re.findall(r"(\d+\.?\d*)\s*±\s*(\d+\.?\d*)", s)
        if mean_sd_match:
            for m, sd in mean_sd_match:
                mean_sd_values.append({"mean": float(m), "sd": float(sd)})
            continue

    return {
        "mean_sd": mean_sd_values,
        "within_p": within_p_values,
        "between_p": between_p_values,
        "improvement": improvement_pcts,
        "comparative": comparative_pcts,
    }


def _join_fragmented_lines(lines):
    """PDF에서 분리된 줄을 논리적으로 합친다.

    패턴:
    - "대조군" + "대비 개선율" → "대조군 대비 개선율"
    - "대조군 대비" + "개선율" → "대조군 대비 개선율"
    - "군내비교" + "유의확률" → "군내비교 유의확률"
    - "시험제품 사용 전" + "대비 2주 사용 후" → "시험제품 사용 전 대비 2주 사용 후"
    """
    stripped = [l.strip() for l in lines]
    result = []
    i = 0
    while i < len(stripped):
        s = stripped[i]

        # 다음 줄과 합칠지 판단
        if i + 1 < len(stripped):
            nxt = stripped[i + 1]
            combined = s + " " + nxt

            # "대조군" + "대비" 또는 "대조군 대비" + "개선율"
            if s.endswith("대조군") and nxt.startswith("대비"):
                result.append(combined)
                i += 2
                continue
            if "대비" in s and nxt == "개선율":
                result.append(combined)
                i += 2
                continue
            if re.match(r"^(대조군|시험군)\d*\s*대비$", s):
                result.append(combined)
                i += 2
                continue
            # "시험군1 대비" + "대조군3" 패턴
            if re.search(r"(대조군|시험군)\d*\s*대비$", s):
                result.append(combined)
                i += 2
                continue

            # "군내비교" + "유의확률"
            if s == "군내비교" and "유의확률" in nxt:
                result.append(combined)
                i += 2
                continue
            if s == "군간비교" and "유의확률" in nxt:
                result.append(combined)
                i += 2
                continue

            # "시험제품 사용 전" + "대비 X주 사용 후"
            if "사용 전" in s and nxt.startswith("대비"):
                result.append(combined)
                i += 2
                continue

        result.append(s)
        i += 1

    return result


def split_improvement_pairs(pcts, n_timepoints):
    """개선율 리스트를 시험군/대조군 쌍으로 분리한다.

    패턴: [시험군1시점, 대조군1시점, 시험군2시점, 대조군2시점, ...]
    또는: [시험군1시점, 시험군2시점, 대조군1시점, 대조군2시점, ...]
    """
    if not pcts:
        return [], []

    n = len(pcts)
    if n_timepoints > 0 and n == n_timepoints * 2:
        # 쌍으로 분리: 시험/대조 교대 패턴
        test_vals = []
        ctrl_vals = []
        for i in range(0, n, 2):
            test_vals.append(pcts[i])
            if i + 1 < n:
                ctrl_vals.append(pcts[i + 1])
        return test_vals, ctrl_vals
    elif n >= 2 and n % 2 == 0:
        half = n // 2
        return pcts[:half], pcts[half:]
    return pcts, []


def parse_efficacy_tables(ch5_text, lang="ko"):
    """효능 시험 5장에서 모든 테이블을 파싱한다."""
    results = []

    table_pattern = re.compile(
        r"Table\s+\d+\.\s*(.*?)(?=Table\s+\d+\.|1\)p-value|$)", re.DOTALL
    )
    tables = table_pattern.findall(ch5_text)

    for table_text in tables:
        lines = table_text.strip().split("\n")
        if not lines:
            continue

        # 제목에서 지표 식별
        header_text = " ".join(l.strip() for l in lines[:15])
        metric = identify_metric(header_text, lang)

        if not metric:
            continue

        # 복합 테이블 (눈가+팔자) 처리
        if metric == "주름(눈가+팔자)":
            sub_results = parse_compound_wrinkle_table(lines, lang)
            results.extend(sub_results)
            continue

        parsed = parse_table_block(lines)

        if not parsed["improvement"] and not parsed["comparative"]:
            continue

        n_timepoints = max(1, len(parsed["between_p"])) if parsed["between_p"] else 1

        test_impr, ctrl_impr = split_improvement_pairs(
            parsed["improvement"], n_timepoints
        )

        entry = {
            "metric": metric,
            "table_title": lines[0].strip(),
        }

        if parsed["mean_sd"]:
            n_vals = len(parsed["mean_sd"])
            if n_vals >= 2:
                half = n_vals // 2
                entry["test_values"] = parsed["mean_sd"][:half]
                entry["control_values"] = parsed["mean_sd"][half:]

        if test_impr:
            entry["test_improvement"] = test_impr
        if ctrl_impr:
            entry["control_improvement"] = ctrl_impr
        if parsed["comparative"]:
            entry["comparative_improvement"] = parsed["comparative"]
        if parsed["between_p"]:
            entry["between_group_p"] = parsed["between_p"]
        if parsed["within_p"]:
            entry["within_group_p"] = parsed["within_p"]

        results.append(entry)

    return results


def parse_compound_wrinkle_table(lines, lang="ko"):
    """눈가+팔자 복합 주름 테이블을 2개로 분리하여 파싱한다."""
    results = []

    # "팔자" 키워드가 나오는 지점에서 분리
    split_idx = None
    for i, line in enumerate(lines):
        if i > 5 and "팔자" in line and "평가인자" in " ".join(l.strip() for l in lines[max(0, i - 3):i + 3]):
            split_idx = i - 3
            break

    if split_idx is None:
        # 분리 실패 시 전체를 눈가로 처리
        for i, line in enumerate(lines):
            if i > 10 and "팔자" in line:
                split_idx = i
                break

    if split_idx and split_idx > 5:
        part1 = lines[:split_idx]
        part2 = lines[split_idx:]

        parsed1 = parse_table_block(part1)
        if parsed1["improvement"] or parsed1["comparative"]:
            n_tp = max(1, len(parsed1["between_p"])) if parsed1["between_p"] else 1
            test1, ctrl1 = split_improvement_pairs(parsed1["improvement"], n_tp)
            entry1 = {
                "metric": "주름(눈가)",
                "table_title": lines[0].strip(),
            }
            if test1:
                entry1["test_improvement"] = test1
            if ctrl1:
                entry1["control_improvement"] = ctrl1
            if parsed1["comparative"]:
                entry1["comparative_improvement"] = parsed1["comparative"]
            if parsed1["between_p"]:
                entry1["between_group_p"] = parsed1["between_p"]
            results.append(entry1)

        parsed2 = parse_table_block(part2)
        if parsed2["improvement"] or parsed2["comparative"]:
            n_tp = max(1, len(parsed2["between_p"])) if parsed2["between_p"] else 1
            test2, ctrl2 = split_improvement_pairs(parsed2["improvement"], n_tp)
            entry2 = {
                "metric": "주름(팔자)",
                "table_title": lines[0].strip(),
            }
            if test2:
                entry2["test_improvement"] = test2
            if ctrl2:
                entry2["control_improvement"] = ctrl2
            if parsed2["comparative"]:
                entry2["comparative_improvement"] = parsed2["comparative"]
            if parsed2["between_p"]:
                entry2["between_group_p"] = parsed2["between_p"]
            results.append(entry2)

    return results


def parse_english_tables(ch5_text):
    """영문 보고서 5장에서 모든 테이블을 파싱한다."""
    results = []

    table_pattern = re.compile(
        r"Table\s+\d+\.\s*(.*?)(?=Table\s+\d+\.|1\)p-value|$)", re.DOTALL
    )
    tables = table_pattern.findall(ch5_text)

    for table_text in tables:
        lines = table_text.strip().split("\n")
        if not lines:
            continue

        header_text = " ".join(l.strip() for l in lines[:15])
        metric = identify_metric(header_text, "en")
        if not metric:
            continue

        # 영문 보고서도 상태 기반 파싱
        mean_sd_values = []
        improvement_pcts = []
        comparative_pcts = []
        between_p_values = []

        pct_pattern = re.compile(r"(\d+\.?\d*)\s*%")
        state = "data"

        for line in lines:
            s = line.strip()
            if not s:
                continue

            # "Test group – Control group" → 대조군 대비
            if ("Test group" in s and "Control" in s) or "group –" in s or "group -" in s:
                pcts = pct_pattern.findall(s)
                if pcts:
                    comparative_pcts.extend([float(p) for p in pcts])
                else:
                    state = "comparative"
                continue

            if "Improvement rate" in s or "improvement rate" in s:
                state = "improvement"
                pcts = pct_pattern.findall(s)
                if pcts:
                    improvement_pcts.extend([float(p) for p in pcts])
                continue

            if state in ("improvement", "comparative") and "%" in s:
                pcts = pct_pattern.findall(s)
                if pcts:
                    if state == "comparative":
                        comparative_pcts.extend([float(p) for p in pcts])
                    else:
                        improvement_pcts.extend([float(p) for p in pcts])
                continue

            if "between" in s.lower() and "group" in s.lower():
                state = "between_p"
                pv_match = re.search(r"([<>]?\s*0\.\d+|<\s*0\.001)", s)
                if pv_match:
                    between_p_values.append(pv_match.group(0).strip())
                continue

            if state == "between_p":
                pv_match = re.search(r"([<>]?\s*0\.\d+|<\s*0\.001)", s)
                if pv_match:
                    between_p_values.append(pv_match.group(0).strip())
                state = "data"
                continue

            # Before - After line → skip
            if re.match(r"^Before\s*-?\s*After", s, re.IGNORECASE):
                continue

            mean_sd_match = re.findall(r"(\d+\.?\d*)\s*±\s*(\d+\.?\d*)", s)
            if mean_sd_match:
                for m, sd in mean_sd_match:
                    mean_sd_values.append({"mean": float(m), "sd": float(sd)})

        if not improvement_pcts and not comparative_pcts:
            continue

        entry = {"metric": metric, "table_title": lines[0].strip()}

        if mean_sd_values and len(mean_sd_values) >= 2:
            half = len(mean_sd_values) // 2
            entry["test_values"] = mean_sd_values[:half]
            entry["control_values"] = mean_sd_values[half:]

        if improvement_pcts:
            if len(improvement_pcts) >= 2:
                entry["test_improvement"] = [improvement_pcts[0]]
                entry["control_improvement"] = [improvement_pcts[1]]
            else:
                entry["test_improvement"] = improvement_pcts

        if comparative_pcts:
            entry["comparative_improvement"] = comparative_pcts

        if between_p_values:
            entry["between_group_p"] = between_p_values

        results.append(entry)

    return results


def parse_absorption_tables(full_text, report_code):
    """흡수도 시험 보고서를 파싱한다."""
    results = []

    table_pattern = re.compile(
        r"Table\s+\d+\.\s*(.*?)(?=Table\s+\d+\.|1\)p-value|Fig|$)", re.DOTALL
    )
    tables = table_pattern.findall(full_text)

    for table_text in tables:
        lines = table_text.strip().split("\n")
        if not lines:
            continue

        header_text = " ".join(l.strip() for l in lines[:15])

        metric = None
        if "흡수량" in header_text:
            metric = "흡수량"
        elif "흡수 깊이" in header_text or "흡수깊이" in header_text:
            metric = "흡수 깊이"
        elif "흡수 속도" in header_text or "흡수속도" in header_text:
            metric = "흡수 속도"

        if not metric:
            continue

        parsed = parse_table_block(lines)

        # 흡수도 보고서는 개선율 패턴이 다를 수 있다
        # "대조군 대비 시험군 XX%" 패턴도 있다
        extra_comp = []
        for line in lines:
            s = line.strip()
            if ("대조군 대비" in s or "대조군" in s) and "시험군" in s:
                pcts = re.findall(r"(\d+\.?\d*)\s*%", s)
                extra_comp.extend([float(p) for p in pcts])

        all_comparative = parsed["comparative"] + extra_comp

        if not parsed["improvement"] and not all_comparative:
            continue

        n_tp = max(1, len(parsed["between_p"])) if parsed["between_p"] else 1
        test_impr, ctrl_impr = split_improvement_pairs(parsed["improvement"], n_tp)

        entry = {
            "metric": metric,
            "table_title": lines[0].strip(),
        }

        if parsed["mean_sd"]:
            n_vals = len(parsed["mean_sd"])
            if n_vals >= 2:
                half = n_vals // 2
                entry["test_values"] = parsed["mean_sd"][:half]
                entry["control_values"] = parsed["mean_sd"][half:]

        if test_impr:
            entry["test_improvement"] = test_impr
        if ctrl_impr:
            entry["control_improvement"] = ctrl_impr
        if all_comparative:
            entry["comparative_improvement"] = all_comparative
        if parsed["between_p"]:
            entry["between_group_p"] = parsed["between_p"]

        results.append(entry)

    return results


def parse_report(report_code):
    """보고서 하나를 파싱한다."""
    meta = REPORT_META.get(report_code)
    if not meta:
        print(f"  [SKIP] 메타데이터 없음: {report_code}")
        return None

    if meta["type"] == "safety":
        return {
            "report_code": report_code,
            **meta,
            "safety_data": {
                "product": meta.get("product", ""),
                "title": meta.get("title", ""),
                "irritation_index": meta.get("irritation_index"),
                "result": meta.get("result", ""),
            },
        }

    pdf_path = find_pdf_for_code(report_code)
    if not pdf_path:
        print(f"  [SKIP] PDF 없음: {report_code}")
        return None

    print(f"  파싱 중: {os.path.basename(pdf_path)}")
    pages = extract_full_text(pdf_path)
    lang = meta.get("lang", "ko")

    if meta["type"] == "absorption":
        full_text = "\n".join(pages)
        metrics = parse_absorption_tables(full_text, report_code)
    elif lang == "en":
        ch5_text = extract_chapter5_text(pages, "en")
        metrics = parse_english_tables(ch5_text)
    else:
        ch5_text = extract_chapter5_text(pages, "ko")
        metrics = parse_efficacy_tables(ch5_text, "ko")

    return {
        "report_code": report_code,
        **meta,
        "metrics": metrics,
    }


def parse_all():
    """모든 보고서를 파싱하여 JSON으로 저장한다."""
    print("=== 임상시험 PDF 파싱 시작 ===\n")
    all_data = []

    for report_code in REPORT_META:
        result = parse_report(report_code)
        if result:
            all_data.append(result)
            metric_count = len(result.get("metrics", []))
            if result.get("type") == "safety":
                print(f"  -> 안전성: {result['safety_data']['result']}")
            else:
                print(f"  -> {metric_count}개 지표 추출")
                for m in result.get("metrics", []):
                    comp = m.get("comparative_improvement", [])
                    comp_str = f", 대조군 대비: {comp}" if comp else ""
                    test = m.get("test_improvement", [])
                    ctrl = m.get("control_improvement", [])
                    print(f"     {m['metric']}: 시험군 {test}, 대조군 {ctrl}{comp_str}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\n=== 완료: {len(all_data)}건 → {OUTPUT_PATH} ===")
    return all_data


if __name__ == "__main__":
    parse_all()
