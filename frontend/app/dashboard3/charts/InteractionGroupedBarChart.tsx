"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import {
  InteractionChartMode,
  InteractionMatrixRow,
} from "../../../lib/interaction-types";

type Props = {
  data: InteractionMatrixRow[];
  cols: string[];
  mode: InteractionChartMode;
  metric: "content_volume" | "publish_rate";
};

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const COLORS = [
  "#6D4AFF",
  "#18D2FF",
  "#22C55E",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#3B82F6",
  "#F97316",
  "#A855F7",
  "#E11D48",
  "#06B6D4",
  "#84CC16",
  "#F43F5E",
  "#10B981",
  "#FACC15",
  "#38BDF8",
];

const MAX_LEGEND_ITEMS = 8;
const MIN_WIDTH_PER_CHANNEL = 120;

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const items = useMemo(() => {
    if (!payload) return [];
    return payload.filter((entry) => entry && entry.value !== undefined);
  }, [payload]);

  if (!active || !items.length) return null;

  return (
    <div
      style={{
        background: "#0f1b36",
        border: "1px solid #2a3b59",
        borderRadius: "14px",
        padding: "12px 14px",
        color: "#ffffff",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        minWidth: "240px",
        maxWidth: "320px",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 10,
          color: "#ffffff",
          fontSize: "15px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          maxHeight: "190px",
          overflowY: "auto",
          overflowX: "hidden",
          direction: "rtl",
          width: "100%",
          scrollbarWidth: "thin",
        }}
      >
        <div
          style={{
            direction: "ltr",
            paddingLeft: "6px",
          }}
        >
          {items.map((entry, index) => (
            <div
              key={`${entry?.dataKey}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: entry?.color || "#ffffff",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: 1.3,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  background: entry?.color || "#ffffff",
                  flexShrink: 0,
                }}
              />
              <span>
                {entry?.name}:{" "}
                <span style={{ color: "#ffffff" }}>{entry?.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InteractionGroupedBarChart({
  data,
  cols,
  mode,
  metric,
}: Props) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const chartWidth = Math.max(1100, data.length * MIN_WIDTH_PER_CHANNEL);
  const visibleLegendCols = cols.slice(0, MAX_LEGEND_ITEMS);
  const hiddenLegendCount = Math.max(0, cols.length - MAX_LEGEND_ITEMS);

  const visibleLegendPayload = visibleLegendCols.map((col, index) => ({
    value: col,
    type: "square" as const,
    id: col,
    color: COLORS[index % COLORS.length],
    dataKey: col,
  }));

  return (
    <div className="rounded-[24px] border border-[#22304a] bg-[#0b1630] p-4">
      <div className="overflow-x-auto pb-3">
        <div style={{ width: `${chartWidth}px`, minWidth: "100%" }}>
          <div className="h-[430px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
                barCategoryGap="18%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#22304a"
                  vertical={false}
                />

                <XAxis
                  dataKey="rowLabel"
                  interval={0}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#314158" }}
                  tickLine={{ stroke: "#314158" }}
                />

                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#314158" }}
                  tickLine={{ stroke: "#314158" }}
                  domain={metric === "publish_rate" ? [0, 100] : [0, "auto"]}
                />

                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  content={<CustomTooltip />}
                  wrapperStyle={{
                    pointerEvents: "auto",
                    zIndex: 1000,
                  }}
                  isAnimationActive={false}
                />

                <Legend
                  payload={visibleLegendPayload}
                  wrapperStyle={{
                    color: "#cbd5e1",
                    paddingTop: "18px",
                    cursor: "pointer",
                  }}
                  onClick={(e: any) => {
                    if (!e?.dataKey) return;
                    setActiveKey((prev) => (prev === e.dataKey ? null : e.dataKey));
                  }}
                />

                {cols.map((col, index) => {
                  const color = COLORS[index % COLORS.length];
                  const isSeriesActive = !activeKey || activeKey === col;

                  return (
                    <Bar
                      key={col}
                      dataKey={col}
                      fill={color}
                      stackId={mode === "stacked" ? "interaction" : undefined}
                      radius={mode === "stacked" ? [0, 0, 0, 0] : [6, 6, 0, 0]}
                      onClick={() =>
                        setActiveKey((prev) => (prev === col ? null : col))
                      }
                    >
                      {data.map((_, i) => (
                        <Cell
                          key={`${col}-${i}`}
                          fill={color}
                          fillOpacity={!activeKey ? 1 : isSeriesActive ? 1 : 0.9}
                          stroke={activeKey === col ? "#ffffff" : "none"}
                          strokeWidth={activeKey === col ? 2 : 0}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Bar>
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {hiddenLegendCount > 0 && (
        <div className="mt-2 text-sm text-[#94a3b8]">
          Showing first {MAX_LEGEND_ITEMS} users in legend. +{hiddenLegendCount} more are available in the tooltip on hover.
        </div>
      )}
    </div>
  );
}