"use client"

import { useState } from "react"

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

export default function ChannelBar({
channels = [],
types = [],
users = [],
platform = "",
barColor = "#6366f1"
}: any){

const [tab,setTab] = useState("videos")

const channelData = Array.isArray(channels) ? channels : []
const typeData = Array.isArray(types) ? types : []
const userData = Array.isArray(users) ? users : []

function isAllZero(arr:any[], key:string){

if(!arr || arr.length===0) return true

return arr.every((item:any)=>!item[key] || item[key]===0)

}

let data:any[] = []
let xKey = ""
let yKey = ""

switch(tab){

case "videos":
data = channelData
xKey = "channel"
yKey = "videos"
break

case "duration":
data = channelData
xKey = "channel"
yKey = "duration"
break

case "efficiency":
data = channelData
xKey = "channel"
yKey = "efficiency"
break

case "types":
data = typeData
xKey = "type"
yKey = "value"
break

case "users":
data = userData
xKey = "user"
yKey = "value"
break

default:
data=[]
}

return(

<div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">

<h2 className="text-white text-lg font-semibold mb-1">
Channel Analytics
</h2>

<p className="text-slate-400 text-sm mb-4">
Platform: <span className="inline-flex items-center gap-1">
  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: barColor }}></span>
  <span className="text-indigo-400 font-medium">{platform || "All"}</span>
</span>
</p>

{/* Tabs */}

<div className="flex gap-2 flex-wrap mb-4">

<button
disabled={isAllZero(channelData,"videos")}
onClick={()=>setTab("videos")}
className={`px-3 py-1 rounded text-sm transition ${tab==="videos" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"} ${isAllZero(channelData,"videos") ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
>
Videos
</button>

<button
disabled={isAllZero(channelData,"duration")}
onClick={()=>setTab("duration")}
className={`px-3 py-1 rounded text-sm transition ${tab==="duration" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"} ${isAllZero(channelData,"duration") ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
>
Duration
</button>

<button
disabled={isAllZero(channelData,"efficiency")}
onClick={()=>setTab("efficiency")}
className={`px-3 py-1 rounded text-sm transition ${tab==="efficiency" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"} ${isAllZero(channelData,"efficiency") ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
>
Efficiency
</button>

<button
disabled={isAllZero(typeData,"value")}
onClick={()=>setTab("types")}
className={`px-3 py-1 rounded text-sm transition ${tab==="types" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"} ${isAllZero(typeData,"value") ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
>
Content Types
</button>

<button
disabled={isAllZero(userData,"value")}
onClick={()=>setTab("users")}
className={`px-3 py-1 rounded text-sm transition ${tab==="users" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"} ${isAllZero(userData,"value") ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
>
Top Users
</button>

</div>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data} barGap={8} barCategoryGap="20%">

<CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>

<XAxis dataKey={xKey} stroke="#94a3b8"/>

<YAxis stroke="#94a3b8"/>

<Tooltip/>

<Bar
dataKey={yKey}
fill={barColor}
barSize={24}
radius={[6,6,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

)

}