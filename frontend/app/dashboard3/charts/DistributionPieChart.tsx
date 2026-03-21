"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";

import { DistributionItem } from "../../../lib/dashboard3-types";

type Props = {
  data: DistributionItem[];
  activeLabel: string | null;
  onSelect: (label: string) => void;
};

interface ChartEntry {
  label?: string;
  name?: string;
  payload?: {
    label?: string;
    name?: string;
  };
}

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

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  // ✅ Correctly typed formatter (IMPORTANT FIX)
  const tooltipFormatter: TooltipProps<ValueType, NameType>["formatter"] = (
    value,
    _name,
    item
  ) => {
    const val = Number(value) || 0;
    const percent = total ? ((val / total) * 100).toFixed(1) : "0.0";

    const label =
      (item?.payload as ChartEntry)?.label || "Value";

    return [`${val} (${percent}%)`, label];
  };

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
            onClick={(entry: unknown) => {
              const e = entry as ChartEntry;
              const label =
                e?.label || e?.name || e?.payload?.label;
              if (label) onSelect(label);
            }}
          >
            {formattedData.map((item) => (
              <Cell
                key={item.label}
                fill={item.fill}
                fillOpacity={
                  activeLabel && activeLabel !== item.label ? 0.35 : 1
                }
                stroke={activeLabel === item.label ? "#ffffff" : "#0b1630"}
                strokeWidth={activeLabel === item.label ? 3 : 1}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#111c36",
              border: "1px solid #2a3b59",
              borderRadius: "14px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#cbd5e1", fontWeight: 600 }}
            formatter={tooltipFormatter}
          />

          <Legend wrapperStyle={{ color: "#cbd5e1", paddingTop: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}