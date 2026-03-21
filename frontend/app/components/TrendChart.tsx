"use client"

import { useState } from "react"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Legend
} from "recharts"

type Props = {
countData:any[]
durationData:any[]
}

export default function TrendChart({countData,durationData}:Props){

const [tab,setTab]=useState("counts")

const rateData = countData.map((item:any)=>{

const publish_rate =
item["Total Uploaded"]>0
? (item["Total Published"]/item["Total Uploaded"])*100
:0

const durationRow = durationData.find((d:any)=>d.Month===item.Month)

const compression_rate = durationRow ? durationRow["Compression Rate"] : 0
const trimming_rate = durationRow ? durationRow["Trimming Rate"] : 0

return{
Month:item.Month,
publish_rate:Number(publish_rate.toFixed(2)),
compression_rate,
trimming_rate
}

})

return(

<div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">

<h2 className="text-white text-lg font-semibold mb-6">
Trend Summary
</h2>

<div className="flex gap-3 mb-6">

<button
onClick={()=>setTab("counts")}
className={`px-4 py-2 rounded-md text-sm ${
tab==="counts"
? "bg-indigo-600 text-white"
: "bg-slate-800 text-slate-300"
}`}
>
Processing Counts
</button>

<button
onClick={()=>setTab("rates")}
className={`px-4 py-2 rounded-md text-sm ${
tab==="rates"
? "bg-indigo-600 text-white"
: "bg-slate-800 text-slate-300"
}`}
>
Rates
</button>

<button
onClick={()=>setTab("duration")}
className={`px-4 py-2 rounded-md text-sm ${
tab==="duration"
? "bg-indigo-600 text-white"
: "bg-slate-800 text-slate-300"
}`}
>
Duration
</button>

</div>

{/* COUNTS */}

{tab==="counts" &&(

<ResponsiveContainer width="100%" height={320}>

<LineChart data={countData}>

<CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>

<XAxis dataKey="Month" stroke="#94a3b8"/>

<YAxis stroke="#94a3b8"/>

<Tooltip/>

<Legend/>

<Line
type="monotone"
dataKey="Total Uploaded"
stroke="#6366f1"
strokeWidth={3}
/>

<Line
type="monotone"
dataKey="Total Created"
stroke="#22c55e"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

)}

{/* RATES */}

{tab==="rates" &&(

<ResponsiveContainer width="100%" height={320}>

<LineChart data={rateData}>

<CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>

<XAxis dataKey="Month" stroke="#94a3b8"/>

<YAxis
stroke="#94a3b8"
tickFormatter={(v)=>`${v}%`}
/>

<Tooltip/>

<Legend/>

<Line
type="monotone"
dataKey="publish_rate"
name="Publish Rate"
stroke="#f59e0b"
strokeWidth={3}
/>

<Line
type="monotone"
dataKey="compression_rate"
name="Compression Rate"
stroke="#22c55e"
strokeWidth={3}
/>

<Line
type="monotone"
dataKey="trimming_rate"
name="Trimming Rate"
stroke="#8b5cf6"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

)}

{/* DURATION */}

{tab==="duration" &&(

<ResponsiveContainer width="100%" height={320}>

<LineChart data={durationData}>

<CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>

<XAxis dataKey="Month" stroke="#94a3b8"/>

<YAxis stroke="#94a3b8"/>

<Tooltip/>

<Legend/>

<Line
type="monotone"
dataKey="Total Uploaded Duration"
stroke="#60a5fa"
strokeWidth={3}
/>

<Line
type="monotone"
dataKey="Total Published Duration"
stroke="#a78bfa"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

)}

</div>

)

}