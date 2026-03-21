"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { DistributionItem } from "../../../lib/dashboard3-types";

type Props = {
  data: DistributionItem[];
  activeLabel: string | null;
  onSelect: (label: string) => void;
};

const COLORS = [
  "#6D4AFF",
  "#18D2FF",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#14B8A6",
  "#F97316",
  "#3B82F6",
  "#EC4899",
];

export default function DistributionBarChart({
  data,
  activeLabel,
  onSelect,
}: Props) {
  const formattedData = data.map((item, index) => ({
    ...item,
    shortLabel: item.label.length > 14 ? `${item.label.slice(0, 14)}...` : item.label,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-[360px] w-full rounded-[24px] border border-[#22304a] bg-[#0b1630] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 20, left: 0, bottom: 45 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#22304a" vertical={false} />
          <XAxis
            dataKey="shortLabel"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#314158" }}
            tickLine={{ stroke: "#314158" }}
            angle={-18}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#314158" }}
            tickLine={{ stroke: "#314158" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const item = payload[0]?.payload;

              return (
                <div
                  style={{
                    backgroundColor: "#111c36",
                    border: "1px solid #2a3b59",
                    borderRadius: "14px",
                    color: "#ffffff",
                    padding: "10px 14px",
                  }}
                >
                  {item.label} : {item.value}
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            onClick={(entry: unknown) => {
              // Safely cast and extract the label
              const data = entry as { label?: string; payload?: { label?: string; name?: string } };
              const labelToSelect = data?.label || data?.payload?.label || data?.payload?.name;
              
              // Only call onSelect if we successfully found a string
              if (labelToSelect) {
                onSelect(labelToSelect);
              }
            }}
          >
            {formattedData.map((item) => {
              const isActive = activeLabel === item.label;
              const hasSelection = !!activeLabel;

              return (
                <Cell
                  key={item.label}
                  fill={item.fill}
                  fillOpacity={!hasSelection ? 0.95 : isActive ? 1 : 0.35}
                  stroke={isActive ? "#ffffff" : "none"}
                  strokeWidth={isActive ? 2 : 0}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}