"use client"

import CountUp from "react-countup"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function KPIcard({ title, value }: any) {

  const isNumber = typeof value === "number"
  const numberValue = isNumber ? value : 0
  const trend = Math.random() > 0.5 ? "up" : "down" // replace later with backend metric

  return (

    <div className="relative group">

      {/* Gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-sm group-hover:opacity-70 transition"/>

      <div className="relative bg-[#0f172a] border border-slate-800 rounded-xl p-6 hover:scale-[1.03] transition-all duration-300 h-full flex flex-col justify-between">

        <p className="text-gray-400 text-sm font-medium tracking-wide">
          {title}
        </p>

        <div className="flex items-center justify-between mt-3">

          <h2 className="text-3xl font-bold text-white">

            {isNumber ? (
              <CountUp
                end={numberValue}
                duration={2}
                separator=","
                decimals={numberValue % 1 !== 0 ? 2 : 0}
              />
            ) : (
              value
            )}

          </h2>

          <div className={`flex items-center text-sm ${
            trend === "up" ? "text-green-400" : "text-red-400"
          }`}>

            {trend === "up" ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}

          </div>

        </div>

      </div>

    </div>

  )
}