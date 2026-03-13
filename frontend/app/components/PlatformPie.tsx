"use client"

import {PieChart,Pie,Cell,Tooltip} from "recharts"

const COLORS=[
"#ff4d4f",
"#ec4899",
"#8b5cf6",
"#3b82f6",
"#06b6d4",
"#64748b"
]

export default function PlatformPie({data,onSelect}:any){

return(

<div className="bg-[#0f172a] p-6 rounded-xl">

<h2 className="text-white mb-4">
Channel Distribution
</h2>

<PieChart width={300} height={300}>

<Pie
data={data}
dataKey="value"
nameKey="platform"
outerRadius={110}
onClick={(d)=>onSelect(d.platform)}
>

{data.map((entry:any,index:number)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))}

</Pie>

<Tooltip/>

</PieChart>

</div>

)

}