"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer ,Legend} from "recharts"
import { useEffect, useState } from "react"
import {fetchOutputDistribution} from  "@/services/api4"

const COLORS = ["#8884d8","#82ca9d","#ffc658","#ff7f50","#00C49F"]

export default function OutputTypeDistribution() {

  const [data,setData] = useState([])

  useEffect(() => {
  fetchOutputDistribution().then(res => {
    setData(res || [])
  })
  }, [])
const enrichedData = data.map((item : any) => ({
  ...item,
  publish_rate:
    item.created_count > 0
      ? (item.published_count / item.created_count) * 100
      : 0
}))
  const totalRate = enrichedData.reduce((sum, item:any) => sum + item.publish_rate, 0)
  return(
    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
      <h2 className="text-lg font-semibold mb-2 text-white">Output Type Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={enrichedData}
            dataKey="publish_rate"
            nameKey="output_type"
            outerRadius={120}
            label={({ name, value }) => {
            const percent = value/totalRate *100
            return `${name} ${percent.toFixed(2)}%`
}}
          >
            {data.map((entry,index)=>(
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
           <Tooltip
            formatter={(value, name, props) => [
              value,
              props.payload.output_type
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}