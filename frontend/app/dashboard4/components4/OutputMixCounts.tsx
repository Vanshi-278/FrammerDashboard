"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,Line } from "recharts"
import { fetchOutputDistribution } from "@/services/api4"

export default function OutputMixCounts() {

  const [data,setData] = useState([])

  useEffect(()=>{
    fetchOutputDistribution().then(res=>{
      setData(res || [])
    })
  },[])
const enrichedData = data.map((item : any) => ({
  ...item,
  publish_rate:
     item.created_count > 0
      ? (item.published_count / item.created_count) * 100
      : 0
}))
  return (

  <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

  <h2 className="text-lg font-semibold mb-2 text-white">
  Output Mix (Counts)
  </h2>

  <ResponsiveContainer width="100%" height={350}>

  <BarChart data={enrichedData} >
  <XAxis dataKey="output_type" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <Tooltip />

  <Bar yAxisId="left" dataKey="created_count" fill="#8884d8" name="Created" />
  <Bar yAxisId="left" dataKey="uploaded_count" fill="#e29b00" name="Uploaded" />
  <Bar yAxisId="left" dataKey="published_count" fill="#174f2c" name="Published" />
 

</BarChart>


  </ResponsiveContainer>

  </div>

  )
}