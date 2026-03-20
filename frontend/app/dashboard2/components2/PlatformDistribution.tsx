"use client"

import { useEffect,useState } from "react"
import { getPlatformDistribution } from "@/services/api2"

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

const COLORS = [
"#6366f1","#22c55e","#f472b6","#f59e0b",
"#06b6d4","#8b5cf6","#ef4444","#14b8a6"
]

export default function PlatformDistribution(){

  const [data,setData] = useState([])

  useEffect(()=>{
    getPlatformDistribution().then(setData)
  },[])

  return(

    <div className="bg-[#071028] p-6 rounded-xl border border-white/10">

      <h2 className="text-white font-semibold mb-4">
        Platform Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie data={data} dataKey="value" nameKey="platform" outerRadius={100} label>

            {data.map((entry,index)=>(
              <Cell key={index} fill={COLORS[index % COLORS.length]}/>
            ))}

          </Pie>

          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  )
}