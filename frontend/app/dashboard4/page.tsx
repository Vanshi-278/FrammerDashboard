"use client"

import OutputTypeDistribution from "./components4/OutputTypeDistribution"
import OutputTrend from "./components4/OutputTrend"
import OutputMixCounts from "./components4/OutputMixCounts"

export default function Page() {

  return (
    <div className="p-6 bg-[#020617] space-y-8">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-white">
        Output Mix & Publishing
      </h1>

      {/* ================= TOP ROW ================= */}
      <div className="grid grid-cols-2 gap-6">

        <OutputTypeDistribution />
        <OutputMixCounts />

      </div>

      {/* ================= TREND ================= */}
      <OutputTrend />

     
    </div>
  )
}