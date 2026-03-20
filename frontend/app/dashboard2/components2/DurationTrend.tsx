"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

import { getDurationTrend } from "@/services/api2"

export default function DurationTrend() {

  const [period, setPeriod] = useState("month")
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    const res = await getDurationTrend(period)
    setData(res)
  }

  return (

    <div className="bg-[#020e2b] p-6 rounded-xl">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-white font-semibold text-lg">
          Duration Trend (Hours)
        </h2>

        <div className="flex gap-2">

          {["month","week","day"].map((p)=>(
            <button
              key={p}
              onClick={()=>setPeriod(p)}
              disabled={p!=="month"}
              className={`px-3 py-1 text-sm rounded-md transition
              ${
                period === p
                ? "bg-green-500 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
              }${p !== "month" ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {p}
            </button>
          ))}

        </div>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <XAxis dataKey="period" stroke="#9CA3AF"/>

          <YAxis stroke="#9CA3AF"/>

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="uploaded_duration"
            stroke="#6366F1"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="processed_duration"
            stroke="#22C55E"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="published_duration"
            stroke="#EC4899"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )
}