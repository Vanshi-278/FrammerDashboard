export type DistributionDimension =
  | "input_type"
  | "output_type"
  | "channel"
  | "platform"
  | "language";

export type DistributionItem = {
  label: string;
  value: number;
  share: number;
};

export type KPIData = {
  publishRate: number;
  avgPublishingDeclaration: number;
  avgCreationDeclaration: number;
  uploadedCount: number;
  createdCount: number;
  publishedCount: number;
  selection: {
    dimension: string;
    value: string;
  } | null;
};

export type DistributionResponse = {
  dimension: DistributionDimension;
  distribution: DistributionItem[];
  kpis: KPIData;
};