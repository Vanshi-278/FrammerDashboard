import { InteractionMetric, InteractionResponse } from "./interaction-types";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchInteractionAnalysis(
  dim1: string,
  dim2: string,
  metric: InteractionMetric
): Promise<InteractionResponse> {
  const params = new URLSearchParams({
    dim1,
    dim2,
    metric,
  });

  const res = await fetch(`${BASE_URL}/dashboard3/interaction-analysis?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch interaction analysis");
  }

  return res.json();
}