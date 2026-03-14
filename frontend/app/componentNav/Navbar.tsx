"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { href: "/dashboard", label: "Executive Summary" },
  { href: "/dashboard2", label: "Usage & Trends" },
  { href: "/dashboard3", label: "Content Production" },
  { href: "/dashboard4", label: "Output Mix" },
  { href: "/dashboard5", label: "Video Funnel" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#071028]/70 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex gap-6 items-center">

        <h1 className="text-white font-semibold mr-6">
          Frammer Dashboard
        </h1>

        {tabs.map((tab) => {
          const active = pathname === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg
              
              ${active
                ? "text-white"
                : "text-gray-400 hover:text-white"}
              `}
            >
              {tab.label}

              {active && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-400 animate-pulse rounded-full"/>
              )}
            </Link>
          )
        })}

      </div>
    </div>
  )
}