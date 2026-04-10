"use client";

import { Report, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

interface TrialRecord {
  no: number;
  productType: string;
  code: string;
  trialName: string;
  metrics: string;
  period: string;
  product: string;
  partner: string;
  status: string;
  control: string;
  subjects: string;
  lab: string;
  paperStage: string;
  remark: string;
}

const TRIAL_DATA: TrialRecord[] = [
  {
    no: 1, productType: "실리콘패치", code: "HM-0032-21",
    trialName: "문어 흡반 구조 모사 피부 패치",
    metrics: "피부첩포에 의한 일차자극 시험", period: "2024.11.05 ~ 2024.11.07",
    product: "", partner: "-", status: "완료", control: "-",
    subjects: "34명", lab: "휴먼피부과", paperStage: "",
    remark: "시험자수·기간 확인 필요",
  },
  {
    no: 2, productType: "실리콘패치", code: "HE-R24-240219-1",
    trialName: "문어 흡반 구조모사 피부 패치 외 1종",
    metrics: "피부 흡수도", period: "2024.02.19 ~ 2024.03.25",
    product: "성분에디터 그린토마토 포어 리프팅 앰플 플러스", partner: "-",
    status: "완료", control: "WO패치", subjects: "20명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 3, productType: "실리콘패치", code: "HE-R24-240219-2",
    trialName: "문어 흡반 구조 모사 피부 패치 외 2종",
    metrics: "피부 흡수도", period: "2024.02.19 ~ 2024.03.25",
    product: "성분에디터 그린토마토 포어 리프팅 앰플 플러스", partner: "-",
    status: "완료", control: "WO패치", subjects: "5명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 4, productType: "실리콘패치", code: "HM-R25-0975",
    trialName: "겔 + 음압 패치",
    metrics: "경피수분손실량 개선", period: "2025.12.01 ~ 2025.12.15",
    product: "겔(화장품 조성물)", partner: "H&S 바이오랩",
    status: "완료", control: "WO패치", subjects: "23명", lab: "휴먼피부과",
    paperStage: "", remark: "",
  },
  {
    no: 5, productType: "실리콘패치", code: "HM-R25-0996",
    trialName: "미션 크리스탈 젤리 아이&페이스 + 음압패치",
    metrics: "2주 사용 후 피부 이상반응 평가", period: "2025.11.28 ~ 2025.12.12",
    product: "미션 크리스탈 젤리 아이&페이스 세럼", partner: "LG생활건강",
    status: "완료", control: "-", subjects: "22명", lab: "휴먼피부과",
    paperStage: "", remark: "",
  },
  {
    no: 6, productType: "실리콘패치", code: "PNK-25D03-RS1R",
    trialName: "미션 크리스탈 젤리 아이&페이스 단독 사용 대비 음압 패치 병행 사용 인체적용시험",
    metrics: "피부 흡수도 / 흡수속도 / 흡수깊이", period: "2025.12.03 ~ 2025.12.09",
    product: "미션 크리스탈 젤리 아이&페이스 세럼", partner: "LG생활건강",
    status: "완료", control: "WO패치", subjects: "20명", lab: "피엔케이",
    paperStage: "", remark: "",
  },
  {
    no: 7, productType: "실리콘패치", code: "HM-R25-0934",
    trialName: "임상시험용 앰플 + 실리콘 음압 패치",
    metrics: "피부 눈가 주름 개선 / 피부 탄력 개선 / 피부 보습 개선",
    period: "2025.11.14 ~ 2025.11.28",
    product: "임상시험용 앰플", partner: "효성",
    status: "완료", control: "WO패치", subjects: "23명", lab: "휴먼피부과",
    paperStage: "", remark: "",
  },
  {
    no: 8, productType: "실리콘패치", code: "HD-R24-0043",
    trialName: "CNP 더마앤서 액티브 부스트 앰플 + 실리콘 음압 패치",
    metrics: "피부 주름 개선 / 피부 탄력 개선 / 피부 보습 개선 / 색소 침착 개선",
    period: "2025.01.07 ~ 2025.02.04",
    product: "CNP 더마앤서 액티브 부스트 앰플", partner: "LG생활건강/CNP",
    status: "완료", control: "WO패치", subjects: "10명", lab: "휴먼피부과",
    paperStage: "Under revision", remark: "제품명 확인 필요",
  },
  {
    no: 9, productType: "실리콘패치", code: "HM-R25-0666",
    trialName: "메디톡스 뉴라덤 코어타임 앰플 외 1종",
    metrics: "피부 주름 개선 / 피부 탄력 개선 / 피부 광 개선 / 색소 침착 개선",
    period: "2025.08.19 ~ 2025.09.16",
    product: "메디톡스 뉴라덤 코어타임 앰플", partner: "메디톡스",
    status: "완료", control: "WO패치", subjects: "20명", lab: "휴먼피부과",
    paperStage: "Accepted", remark: "제품명 확인 필요",
  },
  {
    no: 10, productType: "실리콘패치", code: "HM-0086-02",
    trialName: "로토제약 CliniScience Eye perfect shot Cream",
    metrics: "저자극테스트", period: "2026.02.10 ~ 2026.02.12",
    product: "로토 CliniScience Eye Cream", partner: "로토제약",
    status: "완료", control: "W/O패치", subjects: "33명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 11, productType: "실리콘패치", code: "HM-0086-01",
    trialName: "로토제약 StemScience Eye Cream",
    metrics: "저자극테스트", period: "2026.02.10 ~ 2026.02.12",
    product: "로토 StemScience Eye Cream", partner: "로토제약",
    status: "완료", control: "W/O패치", subjects: "33명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 12, productType: "실리콘패치", code: "HM-R25-1130",
    trialName: "로토제약 CliniScience Eye perfect shot Cream",
    metrics: "눈가 주름개선 / 피부 보습 개선 / 눈밑 다크서클 개선",
    period: "2026.01.27 ~ 2026.02.24",
    product: "로토 CliniScience Eye Cream", partner: "로토제약",
    status: "완료", control: "W/O패치", subjects: "21명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 13, productType: "실리콘패치", code: "HM-R25-1129",
    trialName: "로토제약 StemScience Eye Cream",
    metrics: "눈가 주름개선 / 피부 보습 개선 / 눈밑 다크서클 개선",
    period: "2026.01.27 ~ 2026.02.24",
    product: "로토 StemScience Eye Cream", partner: "로토제약",
    status: "완료", control: "W/O패치", subjects: "21명", lab: "휴먼피부과",
    paperStage: "", remark: "제품명 확인 필요",
  },
  {
    no: 14, productType: "실리콘패치", code: "HM-R25-1123",
    trialName: "효성 지에프씨셀 엑소 바이탈 9403 파우더 외 3종",
    metrics: "눈가 주름 개선 / 피부 탄력 개선 / 피부 보습 개선",
    period: "2026.01.12 ~ 2026.02.09",
    product: "지에프씨셀 엑소 바이탈 9430 파우더 + Pep8 솔루션",
    partner: "효성", status: "완료", control: "W/O패치",
    subjects: "23명", lab: "휴먼피부과", paperStage: "",
    remark: "제품명 확인 필요",
  },
  {
    no: 15, productType: "실리콘패치", code: "HM-R25-1124",
    trialName: "",
    metrics: "눈가 주름 개선 / 피부 탄력 개선 / 피부 보습 개선",
    period: "2026.01.13 ~ 2026.02.10",
    product: "지에프씨셀 엑소 바이탈 9403 파우더 + Pep8 솔루션",
    partner: "효성", status: "완료", control: "W/O패치 + 벨로즈 MTS",
    subjects: "24명", lab: "휴먼피부과", paperStage: "",
    remark: "제품명·모델번호 확인 필요",
  },
  {
    no: 16, productType: "실리콘패치", code: "HM-R26-0077",
    trialName: "엑소슈티컬 엑소좀 앰플",
    metrics: "눈가 주름 개선 / 피부 탄력 개선 / 피부 보습 개선",
    period: "2026.02.20 ~ 2026.03.06",
    product: "Exo H-Serum", partner: "엑소슈티컬",
    status: "완료", control: "W/O패치", subjects: "20명", lab: "휴먼피부과",
    paperStage: "", remark: "",
  },
  {
    no: 17, productType: "하이드로겔", code: "HR-P25-0036",
    trialName: "옥타겔 마스크",
    metrics: "피부 흡수도", period: "2025.12.10",
    product: "옥타겔 마스크", partner: "뷰티맥스",
    status: "완료", control: "하이드로겔 마스크(패턴X)",
    subjects: "3명", lab: "휴먼피부과", paperStage: "",
    remark: "제품명 확인 필요",
  },
  {
    no: 18, productType: "하이드로겔", code: "HM-R25-1063",
    trialName: "옥타겔 마스크",
    metrics: "24시간 보습 유지 효과 / 피부 탄력 개선 / 안면 피부 주름 개선 / 피부 결 개선 / 피부 밀도 개선 / 피부 모공 개선 / 안면 피부 리프팅 효과",
    period: "2025.1.16 ~ 2025.12.31",
    product: "옥타겔 마스크", partner: "뷰티맥스",
    status: "완료", control: "하이드로겔 마스크(패턴X)",
    subjects: "20명", lab: "휴먼피부과", paperStage: "",
    remark: "제품명 확인 필요",
  },
];

export default function DataSourcesSection({ data, lang }: { data: Report[]; lang: Lang }) {
  const colNo = lang === "ko" ? "No." : "No.";
  const colType = lang === "ko" ? "제품 유형" : lang === "ja" ? "製品タイプ" : "Product Type";
  const colCode = lang === "ko" ? "임상번호" : lang === "ja" ? "臨床番号" : "Trial Code";
  const colName = lang === "ko" ? "임상명" : lang === "ja" ? "臨床名" : "Trial Name";
  const colMetrics = lang === "ko" ? "평가항목" : lang === "ja" ? "評価項目" : "Metrics";
  const colPeriod = lang === "ko" ? "시험 기간" : lang === "ja" ? "試験期間" : "Period";
  const colProduct = lang === "ko" ? "사용 제품" : lang === "ja" ? "使用製品" : "Product";
  const colPartner = lang === "ko" ? "협업기업" : lang === "ja" ? "協業企業" : "Partner";
  const colControl = lang === "ko" ? "대조군" : lang === "ja" ? "対照群" : "Control";
  const colSubjects = lang === "ko" ? "시험자 수" : lang === "ja" ? "被験者数" : "Subjects";
  const colLab = lang === "ko" ? "임상업체" : lang === "ja" ? "臨床機関" : "Lab";
  const colPaper = lang === "ko" ? "논문화" : lang === "ja" ? "論文化" : "Paper";
  const colRemark = lang === "ko" ? "비고" : lang === "ja" ? "備考" : "Remark";

  return (
    <div id="sec-sources">
      <details>
        <summary className="section-title cursor-pointer">{t("sec6_title", lang)}</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-center whitespace-nowrap">{colNo}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colType}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colCode}</th>
                <th className="p-2 border text-left">{colName}</th>
                <th className="p-2 border text-left">{colMetrics}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colPeriod}</th>
                <th className="p-2 border text-left">{colProduct}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colPartner}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colControl}</th>
                <th className="p-2 border text-center whitespace-nowrap">{colSubjects}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colLab}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colPaper}</th>
                <th className="p-2 border text-left whitespace-nowrap">{colRemark}</th>
              </tr>
            </thead>
            <tbody>
              {TRIAL_DATA.map((row) => (
                <tr key={row.code} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{row.no}</td>
                  <td className="p-2 border whitespace-nowrap">{row.productType}</td>
                  <td className="p-2 border font-mono whitespace-nowrap">{row.code}</td>
                  <td className="p-2 border">{row.trialName || "-"}</td>
                  <td className="p-2 border">{row.metrics}</td>
                  <td className="p-2 border whitespace-nowrap">{row.period}</td>
                  <td className="p-2 border">{row.product || "-"}</td>
                  <td className="p-2 border whitespace-nowrap">{row.partner}</td>
                  <td className="p-2 border whitespace-nowrap">{row.control}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{row.subjects}</td>
                  <td className="p-2 border whitespace-nowrap">{row.lab}</td>
                  <td className="p-2 border whitespace-nowrap">
                    {row.paperStage ? (
                      <span className={row.paperStage === "Accepted" ? "text-green-600 font-semibold" : "text-orange-500"}>
                        {row.paperStage}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="p-2 border text-orange-500 text-[11px]">{row.remark || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm">
          <a
            href="https://drive.google.com/drive/u/0/folders/1mQpygZQQZyet2IElyXpFqPrgpt9IMF5V"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            <span>📂</span>
            {lang === "ko" ? "임상결과 드라이브 폴더" : lang === "ja" ? "臨床結果ドライブフォルダ" : "Clinical Results Drive Folder"}
            <span className="text-xs text-gray-400">↗</span>
          </a>
        </div>
      </details>
    </div>
  );
}
