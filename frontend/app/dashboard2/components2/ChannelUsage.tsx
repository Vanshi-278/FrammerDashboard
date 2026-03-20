"use client"

import { useEffect, useState } from "react"
import { getUsageTrend } from "@/services/api2"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

export default function ChannelUsage() {

  const [period, setPeriod] = useState("month")
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await getUsageTrend('month')
    setData(res)
  }

  return (
    <div className="bg-[#071028] p-6 rounded-xl border border-white/10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-semibold text-lg">
          Channel Usage
        </h2>

        <div className="flex gap-2">
          {["month", "week", "day"].map((p) => (
            <button
              key={p}
              onClick={() => p === "month" && setPeriod(p)}
              disabled={p !== "month"}
              className={`px-3 py-1 text-sm rounded-md transition
                ${
                  period === p
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                } ${p !== "month" ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <XAxis dataKey="period" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="uploaded"
            stroke="#6366F1"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="processed"
            stroke="#22C55E"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="published"
            stroke="#EC4899"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}
