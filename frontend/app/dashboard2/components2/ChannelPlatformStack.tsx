"use client"

import { useEffect,useState } from "react"
import { getChannelPlatform } from "@/services/api2"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

export default function ChannelPlatform(){

  const [data,setData] = useState([])

  useEffect(()=>{
    getChannelPlatform().then(setData)
  },[])

  return(

    <div className="bg-[#071028] p-6 rounded-xl border border-white/10">

      <h2 className="text-white font-semibold mb-4">
        Channel Platform Publishing
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid stroke="#1e293b"/>

          <XAxis dataKey="channel" stroke="#94a3b8"/>

          <YAxis stroke="#94a3b8"/>

          <Tooltip/>

          <Legend/>

          <Bar dataKey="Youtube" stackId="a" fill="#ef4444"/>

          <Bar dataKey="Instagram" stackId="a" fill="#f472b6"/>

          <Bar dataKey="Facebook" stackId="a" fill="#6366f1"/>

          <Bar dataKey="Shorts" stackId="a" fill="#22c55e"/>

        </BarChart>

      </ResponsiveContainer>

    </div>

  )
}