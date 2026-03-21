
"use client"

import { useEffect, useState } from "react"

type Alert = {
  type: "critical" | "warning" | "info"
  message: string
}

export default function Alerts({ alerts }: { alerts: Alert[] }) {

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!alerts || alerts.length === 0) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % alerts.length)
    }, 3000) // 3 sec

    return () => clearInterval(interval)
  }, [alerts])

  if (!alerts || alerts.length === 0) return null

  const a = alerts[index]

  let bg = ""
  let border = ""

  if (a.type === "critical") {
    bg = "bg-red-900/40"
    border = "border-red-500"
  } else if (a.type === "warning") {
    bg = "bg-yellow-900/40"
    border = "border-yellow-500"
  } else {
    bg = "bg-blue-900/40"
    border = "border-blue-500"
  }

  return (
    <div className="mb-6">
      <div
        className={`p-4 rounded-xl border ${bg} ${border} text-white transition-all duration-500`}
      >
        ⚠ {a.message}
      </div>
    </div>
  )
}