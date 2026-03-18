"use client";

import { useEffect, useState } from "react";
import DistributionBarChart from "../charts/DistributionBarChart";
import DistributionPieChart from "../charts/DistributionPieChart";
import { fetchDistributionData } from "../../../lib/dashboard3-api";
import {
  DistributionDimension,
  DistributionResponse,
} from "../../../lib/dashboard3-types";
import KPISection from "./KPISection";

const dimensionOptions: { label: string; value: DistributionDimension }[] = [
  { label: "Input Type", value: "input_type" },
  { label: "Output Type", value: "output_type" },
  { label: "Channel", value: "channel" },
  { label: "Platform", value: "platform" },
  { label: "Language", value: "language" },
];

export default function DistributionPanel() {
  const [dimension, setDimension] = useState<DistributionDimension>("channel");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [data, setData] = useState<DistributionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadData(nextDimension = dimension, nextSelected = selectedLabel) {
    try {
      setLoading(true);
      const res = await fetchDistributionData(nextDimension, nextSelected);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [dimension, selectedLabel]);

  const handleDimensionChange = (next: DistributionDimension) => {
    setDimension(next);
    setSelectedLabel(null);
  };

  const handleSelect = (label: string) => {
    setSelectedLabel((prev) => (prev === label ? null : label));
  };

  return (
    <section className="rounded-[28px] border border-[#22304a] bg-[#0d1730] shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="border-b border-[#22304a] bg-[#0b1328] px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Distribution Overview</h2>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Toggle dimensions, switch chart type, and click any segment to update KPIs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-[#101c36] p-1">
              {dimensionOptions.map((option) => {
                const active = dimension === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleDimensionChange(option.value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-[#6d4aff] to-[#18d2ff] text-white shadow-md"
                        : "bg-transparent text-[#cbd5e1] hover:bg-[#1a2745]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 rounded-2xl bg-[#101c36] p-1">
              <button
                onClick={() => setChartType("bar")}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  chartType === "bar"
                    ? "bg-[#18d2ff] text-[#08111f]"
                    : "text-[#cbd5e1] hover:bg-[#1a2745]"
                }`}
              >
                Bar
              </button>

              <button
                onClick={() => setChartType("pie")}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  chartType === "pie"
                    ? "bg-[#18d2ff] text-[#08111f]"
                    : "text-[#cbd5e1] hover:bg-[#1a2745]"
                }`}
              >
                Pie
              </button>
            </div>

            {selectedLabel && (
              <button
                onClick={() => setSelectedLabel(null)}
                className="rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff6b8a] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:opacity-90"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="min-h-[460px] border-b border-[#22304a] px-6 py-6 xl:border-b-0 xl:border-r">
          {loading ? (
            <div className="flex h-[360px] items-center justify-center">
              <div className="text-base text-[#94a3b8]">Loading chart...</div>
            </div>
          ) : data ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {dimensionOptions.find((d) => d.value === dimension)?.label} Distribution
                  </h3>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    Click a bar or slice to personalize the KPI cards.
                  </p>
                </div>

                {selectedLabel && (
                  <div className="rounded-xl border border-[#2e4266] bg-[#121f3d] px-4 py-2 text-sm text-[#67e8f9]">
                    Selected: <span className="font-semibold text-white">{selectedLabel}</span>
                  </div>
                )}
              </div>

              {chartType === "bar" ? (
                <DistributionBarChart
                  data={data.distribution}
                  activeLabel={selectedLabel}
                  onSelect={handleSelect}
                />
              ) : (
                <DistributionPieChart
                  data={data.distribution}
                  activeLabel={selectedLabel}
                  onSelect={handleSelect}
                />
              )}
            </>
          ) : (
            <div className="flex h-[360px] items-center justify-center text-[#94a3b8]">
              No data available
            </div>
          )}
        </div>

        <div className="bg-[#0f1a34] px-6 py-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Personalized KPIs</h3>
            <p className="mt-1 text-sm text-[#94a3b8]">
              These values change based on the selected distribution item.
            </p>
          </div>

          {data && <KPISection kpis={data.kpis} />}
        </div>
      </div>
    </section>
  );
}