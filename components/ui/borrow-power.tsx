interface BorrowPowerProps {
  percentage: number
  borrowed: string
  available: string
}

export function BorrowPower({ percentage, borrowed, available }: BorrowPowerProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <div className="bg-[#101010] rounded-xl p-6 card-shadow">
      <h2 className="text-xl font-semibold text-white mb-6">Borrow Power</h2>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#2A2930" strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#EAB308"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              className="progress-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-500">{percentage}%</div>
            <div className="text-sm text-gray-400">Used</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-[#0A0A0A] rounded-lg">
          <span className="text-gray-400">Borrowed</span>
          <span className="text-white font-semibold">{borrowed}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-[#0A0A0A] rounded-lg">
          <span className="text-gray-400">Available</span>
          <span className="text-white font-semibold">{available}</span>
        </div>
      </div>
    </div>
  )
}
