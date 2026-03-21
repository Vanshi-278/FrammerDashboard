"use client"

import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { fetchOutputTrend } from "@/services/api4"

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null
  
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs}h ${mins}m ${secs}s`
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="text-sm">
          <span style={{ color: entry.color }} className="font-semibold">
            {entry.name}: 
          </span>
          <span className="text-gray-200 ml-1">
            {formatDuration(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OutputTrend(){

 const [data, setData] = useState([])

 useEffect(() => {
  fetchOutputTrend().then(res => {
    console.log("API RESPONSE 👉", res)
    setData(res || [] )
  })
}, [])

const processedData = data.map((item: any) => {
  return {
    name: item.output_type,
    "Avg Created": item.created_count > 0 ? item.created_duration / item.created_count : 0,
    "Avg Published": item.published_count > 0 ? item.published_duration / item.published_count : 0
  }
})

 return(
 <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">
   <div className="mb-4">
     <h2 className="text-lg font-semibold text-white">Average Duration by Output Type</h2>
     <p className="text-sm text-gray-400 mt-1">Time comparison between creation and publishing stages</p>
   </div>
  
   <ResponsiveContainer width="100%" height={400}>
     <BarChart
       data={processedData}
       margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
     >
       <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
       <XAxis 
         dataKey="name" 
         stroke="#94a3b8"
         style={{ fontSize: '12px' }}
       />
       <YAxis 
         stroke="#94a3b8"
         style={{ fontSize: '12px' }}
         label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
       />
       <Tooltip content={<CustomTooltip />} />
       <Legend 
         wrapperStyle={{ paddingTop: '20px' }}
         iconType="rect"
       />
       <Bar 
         dataKey="Avg Created" 
         fill="#6366f1" 
         radius={[8, 8, 0, 0]}
         name="Avg Created Duration"
       />
       <Bar 
         dataKey="Avg Published" 
         fill="#10b981" 
         radius={[8, 8, 0, 0]}
         name="Avg Published Duration"
       />
     </BarChart>
   </ResponsiveContainer>
 </div>
 )
}