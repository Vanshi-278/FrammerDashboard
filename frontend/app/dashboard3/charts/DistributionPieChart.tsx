"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

export default function DistributionPieChart({
  data,
  activeLabel,
  onSelect,
}: Props) {
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  // ✅ FIX: move this here (outside JSX)
  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[360px] w-full rounded-[24px] border border-[#22304a] bg-[#0b1630] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={3}
            onClick={(entry) => onSelect(entry.label)}
          >
            {formattedData.map((item) => {
              const isActive = activeLabel === item.label;
              const hasSelection = !!activeLabel;

              return (
                <Cell
                  key={item.label}
                  fill={item.fill}
                  fillOpacity={!hasSelection ? 1 : isActive ? 1 : 0.35}
                  stroke={isActive ? "#ffffff" : "#0b1630"}
                  strokeWidth={isActive ? 3 : 1}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#111c36",
              border: "1px solid #2a3b59",
              borderRadius: "14px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#cbd5e1", fontWeight: 600 }}
            formatter={(value: number, _name, props) => {
              const percent = total
                ? ((value / total) * 100).toFixed(1)
                : "0.0";
              return [`${value} (${percent}%)`, props?.payload?.label || "Value"];
            }}
          />

          <Legend
            wrapperStyle={{
              color: "#cbd5e1",
              paddingTop: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}