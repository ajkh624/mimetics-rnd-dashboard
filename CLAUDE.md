# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

미메틱스(Mimetics) R&D 임상시험 데이터 대시보드. `data/` 폴더에 있는 14개 임상시험 PDF 보고서(휴먼테스트 수행)의 핵심 데이터를 한눈에 볼 수 있는 웹 대시보드.

## Data Source

`data/` 폴더에 한국어 PDF 임상시험 결과보고서 14건 (총 ~900페이지):

| 보고서 코드 | 주요 평가항목 |
|------------|-------------|
| HR-P25-0036 | 피부 흡수도 비교 (예비시험) |
| HM-R25-1063 | 24시간 보습, 탄력, 주름(눈가/팔자), 피부결, 피부밀도, 모공, 안면 피부 밝기 |
| HM-R25-1123 | 눈가 주름 개선, 피부 탄력, 피부 수분 (대조군2 vs 시험군1) |
| HM-R25-1124 | 눈가 주름 개선 (대조군3 vs 시험군1) |
| HM-R25-1129 | 눈가 주름 개선 (Stem Science Eye) |
| HM-R25-1130 | 눈가 주름 개선 (Clini Science Eye) |
| HM-R26-0077 | 눈가 주름 외 |
| HM-R25-0666 | 피부 주름 개선 외 |
| HD-R24-0043 | 피부 주름 개선 외 (영문) |
| HE-R24-240219-1 | 피부 흡수도 (뺨) |
| HE-R24-240219-2 | 피부 흡수도 |
| HM-0032-21 | 자극 테스트 (문어 흡반 구조 패치) |
| HM-0086-01 | 저자극 테스트 (Stem Science Eye + 음압패치) |
| HM-0086-02 | 저자극 테스트 (Clini Science Eye + 음압패치) |

### PDF 구조 패턴

모든 보고서는 동일한 구조를 따름:
- **5장 (시험 결과)** 에 핵심 정량 데이터 테이블이 집중
- 테이블 포맷: Mean±SD, p-value, 개선율(%), 대조군 대비 개선율(%)
- 통계: Paired t-test, Wilcoxon signed rank test, Repeated measures ANOVA, Friedman test, GEE
- 시점: 사용 전 → 1회/2주/4주 사용 후

### PDF 텍스트 추출

PyMuPDF(`fitz`) 사용. Windows cp949 환경에서 `sys.stdout`을 UTF-8로 래핑 필요:
```python
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import fitz
```

## Key Metrics to Dashboard

- **보습**: 유전율(ε) - Capacitance
- **탄력**: CoR (Coefficient of Restitution)
- **주름**: Average depth (mm), Maximum depth
- **피부결**: 거칠기 Ra (Roughness)
- **피부밀도**: Density
- **모공**: Mean pore volume (㎣)
- **밝기**: 피부 처짐 면적(㎠), L* value
- **흡수도**: 피부 흡수율(%)
- **안전성**: 자극/저자극 테스트 결과

## Tech Stack (계획)

프로젝트 초기 단계 — 아직 코드 없음. 대시보드 구현 시 참고:
- PDF 파싱: PyMuPDF (`fitz`), `tabula-py`, 또는 `pdfplumber`
- 데이터 처리: Python (`pandas`)
- 대시보드: Streamlit 또는 Next.js + Chart.js

## Language

- 코드 주석, 커밋 메시지: 한국어 우선
- 변수명, 함수명: 영문
