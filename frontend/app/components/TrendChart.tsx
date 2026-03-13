"use client"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function TrendChart({data}:any){

return(

<div className="bg-[#0f172a] p-6 rounded-xl">

<h2 className="text-white mb-4">
Processing & Publish Trend
</h2>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={data}>

<XAxis dataKey="Month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="Total Uploaded"
stroke="#6366f1"
/>

<Line
type="monotone"
dataKey="Total Published"
stroke="#22c55e"
/>

</LineChart>

</ResponsiveContainer>

</div>

)

}