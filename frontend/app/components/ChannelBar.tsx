"use client"

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function ChannelBar({data}:any){

return(

<div className="bg-[#0f172a] p-6 rounded-xl">

<h2 className="text-white mb-4">
Channel Contribution
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data}>

<XAxis dataKey="channel"/>

<YAxis/>

<Tooltip/>

<Bar
dataKey="value"
fill="#6366f1"
/>

</BarChart>

</ResponsiveContainer>

</div>

)

}