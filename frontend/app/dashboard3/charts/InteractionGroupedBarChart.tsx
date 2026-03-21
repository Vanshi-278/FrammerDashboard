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
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        {label}
      </div>

      {items.map((entry, index) => (
        <div
          key={`${entry?.dataKey}-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: entry?.color || "#ffffff",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              background: entry?.color || "#fff",
            }}
          />
          <span>
            {entry?.name}: {entry?.value}
          </span>
        </div>
      ))}
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
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22304a" />

                <XAxis dataKey="rowLabel" />
                <YAxis domain={metric === "publish_rate" ? [0, 100] : [0, "auto"]} />

                <Tooltip content={<CustomTooltip />} />

                {/* ✅ FIXED LEGEND */}
                <Legend
                  content={() => (
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {visibleLegendPayload.map((item) => (
                        <div
                          key={item.dataKey}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            color: "#cbd5e1",
                          }}
                          onClick={() =>
                            setActiveKey((prev) =>
                              prev === item.dataKey ? null : item.dataKey
                            )
                          }
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              background: item.color,
                            }}
                          />
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                />

                {cols.map((col, index) => {
                  const color = COLORS[index % COLORS.length];
                  const isActive = !activeKey || activeKey === col;

                  return (
                    <Bar key={col} dataKey={col} fill={color}>
                      {data.map((_, i) => (
                        <Cell
                          key={`${col}-${i}`}
                          fillOpacity={isActive ? 1 : 0.3}
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
          Showing first {MAX_LEGEND_ITEMS} users. +{hiddenLegendCount} more in tooltip.
        </div>
      )}
    </div>
  );
}