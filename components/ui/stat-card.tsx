import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  subtitle?: string
}

export function StatCard({ title, value, icon, subtitle }: StatCardProps) {
  return (
    <div className="bg-[#101010] rounded-xl p-6 card-shadow">
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className="text-3xl font-bold text-white mb-4">{value}</div>
      {subtitle && <div className="text-sm text-gray-400 mb-4">{subtitle}</div>}
      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">{icon}</div>
    </div>
  )
}
