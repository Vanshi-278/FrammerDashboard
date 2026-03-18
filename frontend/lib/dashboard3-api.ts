import { DistributionDimension, DistributionResponse } from "./dashboard3-types";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchDistributionData(
  dimension: DistributionDimension,
  selectedValue?: string | null
): Promise<DistributionResponse> {
  const params = new URLSearchParams({
    dimension,
  });

  if (selectedValue) {
    params.append("selected_value", selectedValue);
  }

  const res = await fetch(`${BASE_URL}/dashboard3/distribution?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch distribution data");
  }

  return res.json();
}