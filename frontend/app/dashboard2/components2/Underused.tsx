"use client"

import { useEffect, useState } from "react"
import {
BarChart, Bar, XAxis, YAxis, Tooltip,
ResponsiveContainer, CartesianGrid, Cell
} from "recharts"
import { getContributions } from "@/services/api2"

export default function UnderusedContributions(){

const [level,setLevel] = useState("client")
const [metric,setMetric] = useState("efficiency")
const [period,setPeriod] = useState("year")

const [data,setData] = useState<any[]>([])
const [drillData,setDrillData] = useState<any[]>([])

useEffect(()=>{
load()
},[level,metric,period])

const load = async()=>{
const res = await getContributions(level, undefined, metric, "underused", period)
setData(res.main)
setDrillData([])
}

const handleClick = async (item:any)=>{
const res = await getContributions(level, item.name, metric, "underused", period)
setDrillData(res.drill)
}


const colors = [
"#22D3EE", // cyan
"#22C55E", // green
"#F59E0B", // yellow
"#7C3AED", // purple
"#EF4444", // red
"#14B8A6", // teal
"#F97316", // orange
"#3B82F6", // blue
"#8B5CF6", // violet
"#EC4899", // pink
]

return(
<div className="bg-[#020e2b] p-6 rounded-2xl space-y-6 border border-white/10">

  {/* HEADER */}
  <div className="flex flex-col gap-4">

    <h2 className="text-white text-xl font-semibold">
      Underused Potential 🚨
    </h2>

    {/* CONTROLS */}
    <div className="flex flex-wrap gap-4">

      {/* LEVEL */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
        <span className="text-xs text-gray-400 mr-2">Level</span>

        {["client","channel","user"].map(p=>(
          <button key={p}
            onClick={()=>setLevel(p)}
            className={`px-3 py-1 rounded text-sm transition ${
              level===p
                ? "bg-red-400 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* METRIC */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
        <span className="text-xs text-gray-400 mr-2">Metric</span>

        {["uploaded","published","efficiency"].map(m=>(
          <button key={m}
            onClick={()=>setMetric(m)}
            className={`px-3 py-1 rounded text-sm transition ${
              metric===m
                ? "bg-red-400 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {m === "efficiency" ? "unused %" : m}
          </button>
        ))}
      </div>

      {/* PERIOD */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
        <span className="text-xs text-gray-400 mr-2">Period</span>

        {["year","month","week"].map(p=>(
          <button key={p}
            onClick={()=>p==="year" && setPeriod(p)}
            disabled={p!=="year"}
            className={`px-3 py-1 rounded text-sm transition ${
              period===p
                ? "bg-purple-400 text-black"
                : "bg-gray-700 text-white"
            } ${p!=="year" ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>

    </div>

  </div>

  {/* CHARTS */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* MAIN */}
    <div className="bg-[#071a3a] p-4 rounded-xl h-[320px]">

      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 40 }}>

            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

            <XAxis 
              dataKey="name" 
              angle={-30} 
              textAnchor="end"
              interval={0}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />

            <YAxis 
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8,8,0,0]}
              barSize={32}
              onClick={(d)=>handleClick(d)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      )}

    </div>

    {/* DRILL */}
    <div className="bg-[#071a3a] p-4 rounded-xl h-[320px]">

      {drillData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          Click a bar to see wasted potential
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={drillData} margin={{ bottom: 40 }}>

            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

            <XAxis 
              dataKey="name" 
              angle={-60} 
              textAnchor="end"
              interval={0}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />

            <YAxis 
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8, 8,0,0]}
              barSize={32}
            >
              {drillData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      )}

    </div>

  </div>

</div>


)
}
