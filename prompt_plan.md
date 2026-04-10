# 구현 계획: 새 보고서 4건 추가 + 구글드라이브 링크 수정 + 출처 테이블 업데이트

## 상태: 대기 (사용자 확인 필요)

## 요구사항 정리

1. **새 PDF 4건 파싱 → parsed_data.json에 추가 → 대시보드 자동 반영**
2. **구글드라이브 링크 `u/2/` → `u/0/`로 수정 + 사이드바에 눈에 띄는 링크 추가**
3. **6번 출처 테이블을 스프레드시트 18건 기준으로 재구성**

---

## Phase 1: 새 PDF 4건 파싱 (PyMuPDF)

각 PDF의 5장(시험 결과)에서 정량 데이터 테이블 추출:

| 보고서 | 제품 | 평가항목 | 타입 | 피험자 | 협업기업 |
|--------|------|----------|------|--------|----------|
| HM-R25-0934 | 임상시험용 앰플 | 눈가 주름, 탄력, 보습 | efficacy | 23명 | 효성 |
| HM-R25-0975 | 겔(화장품 조성물) | 경피수분손실량(TEWL) | efficacy | 23명 | H&S바이오랩 |
| HM-R25-0996 | 미션 크리스탈 젤리 아이&페이스 | 피부 이상반응 | safety | 22명 | LG생활건강 |
| PNK-25D03-RS1R | 미션 크리스탈 젤리 아이&페이스 | 흡수도/속도/깊이 | absorption | 20명 | LG생활건강 |

- HM-R25-0996 사본 2개는 동일파일 확인 — 1개만 사용

---

## Phase 2: i18n 및 UI 텍스트 업데이트

- `i18n.ts`: 새 제품명/지표명 번역 추가 (경피수분손실량 등)
- `Dashboard.tsx` footer: "14개" → "18개"
- `hero_subtitle` 등 i18n 숫자 업데이트

---

## Phase 3: 구글드라이브 링크 수정 + 사이드바 추가

- `DataSourcesSection.tsx`: 링크 `u/2/` → `u/0/` 수정
- `Sidebar.tsx`: 가이드 카드 상단에 구글드라이브 폴더 링크 카드 추가 (📂 아이콘 + 파란 배경)

---

## Phase 4: 6번 출처 테이블 재구성 (스프레드시트 18건 기반)

스프레드시트 컬럼: No., 제품 유형, 임상번호, 임상명, 평가항목, 시험 기간, 사용 제품, 협업기업, 대조군 여부, 시험자 수, 임상업체, 논문화 진행 단계

- 스프레드시트 데이터를 정적 배열로 하드코딩
- DataSourcesSection.tsx에서 새 테이블 렌더링

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `dashboard/public/parsed_data.json` | 4건 추가 |
| `dashboard/src/lib/i18n.ts` | 새 제품/지표 번역 + 숫자 업데이트 |
| `dashboard/src/components/Dashboard.tsx` | footer "18개" |
| `dashboard/src/components/DataSourcesSection.tsx` | 드라이브 링크 수정 + 테이블 재구성 |
| `dashboard/src/components/Sidebar.tsx` | 드라이브 링크 카드 추가 |

---

## 이전 계획

### AI 어드바이저 탭 (완료)
- 대시보드 내 AI 채팅 탭 추가 (GPT-5.4 Responses API)
- parsed_data.json 14개 임상시험 데이터 기반 Q&A
