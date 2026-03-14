"use client"

import { useState } from "react"

const tabs = [
  { id: "executive", label: "Executive Summary" },
  { id: "usage", label: "Usage & Trends" },
  { id: "production", label: "Content Production" },
  { id: "output", label: "Output Mix" },
  { id: "funnel", label: "Video Funnel" },
]

export default function Nav() {
  const [active, setActive] = useState("executive")

  const handleScroll = (id: string) => {
    setActive(id)

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#071028]/70 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex gap-6 items-center">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleScroll(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg

            ${active === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-white"
              }
            `}
          >
            {tab.label}

            {active === tab.id && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-400 animate-pulse rounded-full"/>
            )}
          </button>
        ))}

      </div>
    </div>
  )
}