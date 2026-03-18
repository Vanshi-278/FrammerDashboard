export type InteractionMetric = "content_volume" | "publish_rate";
export type InteractionChartMode = "grouped" | "stacked";

export type InteractionDimension = "channel" | "user" | "platform";

export type InteractionMatrixRow = {
  rowLabel: string;
  [key: string]: string | number;
};

export type InteractionResponse = {
  dim1: string;
  dim2: string;
  metric: InteractionMetric;
  rows: string[];
  cols: string[];
  matrix: InteractionMatrixRow[];
  message?: string;
};