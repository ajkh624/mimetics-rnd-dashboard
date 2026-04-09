# Implementation Plan: AI 어드바이저 탭

## 상태: 완료

## 요구사항
- 대시보드 내 AI 채팅 탭 추가
- GPT-5.4 (Responses API) 연동, 스트리밍 응답
- parsed_data.json 14개 임상시험 데이터를 시스템 프롬프트에 주입
- 임상 결과 해석, 인사이트, 실험 방법론 등 Q&A

## 구현 내역

| 파일 | 작업 | 설명 |
|------|------|------|
| `requirements.txt` | 수정 | `openai>=1.30.0` 추가 |
| `src/advisor.py` | 신규 | GPT-5.4 Responses API 스트리밍 + 채팅 UI |
| `src/app.py` | 수정 | 네비게이션 + 섹션에 advisor 탭 추가 |
| `src/i18n.py` | 수정 | 번역 키 5개 추가 (tab_advisor, advisor_title, advisor_intro, advisor_no_key, advisor_placeholder) |

## 기술 스택
- Model: `gpt-5.4` (Responses API, reasoning.effort: medium)
- API: `client.responses.create(stream=True)`
- UI: Streamlit `st.chat_input` + `st.chat_message` + `st.write_stream`

## 배포 참고
- Streamlit Cloud에서 OPENAI_API_KEY 시크릿 등록 필요
- GitHub: https://github.com/dpffpsk3119-alt/clinical-dashboard
