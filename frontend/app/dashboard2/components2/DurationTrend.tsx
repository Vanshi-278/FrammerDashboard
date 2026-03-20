"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
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
    <div className="bg-[#020e2b] p-6 rounded-2xl shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <h2 className="text-white font-semibold text-lg">
          Duration Trend (Hours)
        </h2>

        <div className="flex gap-2 bg-[#0b1a3a] p-1 rounded-lg">
          {["month","week","day"].map((p)=>(
            <button
              key={p}
              onClick={()=>setPeriod(p)}
              disabled={p!=="month"}
              className={`px-3 py-1 text-sm rounded-md transition
              ${
                period === p
                ? "bg-green-500 text-black"
                : "text-gray-300 hover:bg-gray-700"
              }
              ${p !== "month" ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {p}
            </button>
          ))}
        </div>

      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={data}>

          {/* Gradients */}
          <defs>
            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.75}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>

            <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e11e1e" stopOpacity={0.75}/>
              <stop offset="95%" stopColor="#e11e1e" stopOpacity={0}/>
            </linearGradient>

            <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.75}/>
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />

          <XAxis dataKey="period" stroke="#9CA3AF"/>
          <YAxis stroke="#9CA3AF"/>

          <Tooltip
            contentStyle={{
              backgroundColor: "#020e2b",
              border: "1px solid #1f2a44",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Legend />

          {/* Areas (NO STACKING) */}
          <Area
            type="monotone"
            dataKey="uploaded_duration"
            stroke="#6366F1"
            fill="url(#colorUpload)"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="processed_duration"
            stroke="#e11e1e"
            fill="url(#colorProcessed)"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="published_duration"
            stroke="#EC4899"
            fill="url(#colorPublished)"
            strokeWidth={2}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  )
}