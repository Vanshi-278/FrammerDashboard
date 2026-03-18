"use client";

import { useEffect, useMemo, useState } from "react";
import InteractionGroupedBarChart from "../charts/InteractionGroupedBarChart";
import { fetchInteractionAnalysis } from "../../../lib/interaction-api";
import {
  InteractionChartMode,
  InteractionDimension,
  InteractionMetric,
  InteractionResponse,
} from "../../../lib/interaction-types";

const DIM1_OPTIONS: { label: string; value: InteractionDimension }[] = [
  { label: "Channel", value: "channel" },
];

const DIM2_OPTIONS: { label: string; value: InteractionDimension }[] = [
  { label: "User", value: "user" },
  { label: "Platform", value: "platform" },
];

export default function InteractionAnalysis() {
  const [dim1, setDim1] = useState<InteractionDimension>("channel");
  const [dim2, setDim2] = useState<InteractionDimension>("platform");
  const [metric, setMetric] = useState<InteractionMetric>("publish_rate");
  const [chartMode, setChartMode] = useState<InteractionChartMode>("grouped");
  const [data, setData] = useState<InteractionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const matrixSizeText = useMemo(() => {
    if (!data) return "";
    return `${data.rows.length} × ${data.cols.length} matrix`;
  }, [data]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchInteractionAnalysis(dim1, dim2, metric);
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [dim1, dim2, metric]);

  return (
    <section className="rounded-[28px] border border-[#22304a] bg-[#0d1730] shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="border-b border-[#22304a] bg-[#0b1328] px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">2-Dimension Interaction Analysis</h2>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Explore cross-dimensional patterns for the supported combinations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-2xl bg-[#101c36] p-1">
              <button
                onClick={() => setMetric("content_volume")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  metric === "content_volume"
                    ? "bg-white/10 text-[#f8fafc]"
                    : "text-[#94a3b8] hover:bg-[#1a2745]"
                }`}
              >
                Content Volume
              </button>
              <button
                onClick={() => setMetric("publish_rate")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  metric === "publish_rate"
                    ? "bg-white/10 text-[#f59e0b]"
                    : "text-[#94a3b8] hover:bg-[#1a2745]"
                }`}
              >
                Publish Rate
              </button>
            </div>

            <div className="flex rounded-2xl bg-[#101c36] p-1">
              <button
                onClick={() => setChartMode("stacked")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  chartMode === "stacked"
                    ? "bg-white/10 text-[#f8fafc]"
                    : "text-[#94a3b8] hover:bg-[#1a2745]"
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setChartMode("grouped")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  chartMode === "grouped"
                    ? "bg-white/10 text-[#0fd7c4]"
                    : "text-[#94a3b8] hover:bg-[#1a2745]"
                }`}
              >
                Grouped
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#22304a] px-6 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wide text-[#94a3b8]">
                DIM 1 (ROWS)
              </span>
              <select
                value={dim1}
                onChange={(e) => setDim1(e.target.value as InteractionDimension)}
                className="rounded-xl border border-[#2d3d59] bg-[#101c36] px-4 py-2.5 text-sm text-white outline-none"
              >
                {DIM1_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#64748b] text-xl">×</span>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wide text-[#94a3b8]">
                DIM 2 (COLS)
              </span>
              <select
                value={dim2}
                onChange={(e) => setDim2(e.target.value as InteractionDimension)}
                className="rounded-xl border border-[#2d3d59] bg-[#101c36] px-4 py-2.5 text-sm text-white outline-none"
              >
                {DIM2_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {data && (
            <div className="text-sm text-[#94a3b8]">
              <span className="text-white">{matrixSizeText}</span>{" "}
              <span className="text-[#f59e0b]">
                showing {metric === "publish_rate" ? "publish rate %" : "content volume"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex h-[430px] items-center justify-center text-[#94a3b8]">
            Loading interaction analysis...
          </div>
        ) : data?.message ? (
          <div className="flex h-[220px] items-center justify-center rounded-[24px] border border-dashed border-[#314158] bg-[#0b1630] text-[#94a3b8]">
            {data.message}
          </div>
        ) : data ? (
          <InteractionGroupedBarChart
            data={data.matrix}
            cols={data.cols}
            mode={chartMode}
            metric={metric}
          />
        ) : (
          <div className="flex h-[220px] items-center justify-center text-[#94a3b8]">
            No interaction data available
          </div>
        )}
      </div>
    </section>
  );
}