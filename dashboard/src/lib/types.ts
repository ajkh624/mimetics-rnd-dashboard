export interface MetricValue {
  mean: number;
  sd: number;
}

export interface Metric {
  metric: string;
  table_title?: string;
  test_values?: MetricValue[];
  control_values?: MetricValue[];
  test_improvement?: number[];
  control_improvement?: number[];
  comparative_improvement?: number[];
  between_group_p?: (number | string)[];
}

export interface SafetyData {
  product: string;
  title: string;
  irritation_index: number;
  result: string;
}

export interface Report {
  report_code: string;
  type: "efficacy" | "absorption" | "safety";
  product: string;
  duration: string;
  subjects: number;
  title: string;
  body_part?: string;
  metrics: Metric[];
  safety_data?: SafetyData;
  irritation_index?: number;
}

export type Lang = "ko" | "en" | "ja";
