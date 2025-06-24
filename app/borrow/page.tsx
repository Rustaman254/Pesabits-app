"use client"

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/ui/stat-card"
import { AssetTable } from "@/components/ui/asset-table"
import { BorrowPower } from "@/components/ui/borrow-power"
import { DollarSign, Percent, AlertTriangle } from "lucide-react"

export default function BorrowPage() {
  const availableToBorrow = [
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "Available: $2,100",
      apy: "5.25%",
      canBorrow: true,
      color: "#2775CA",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      balance: "Available: $2,100",
      apy: "5.2%",
      canBorrow: true,
      color: "#F5AC37",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      balance: "Available: $2,100",
      apy: "4.8%",
      canBorrow: true,
      color: "#26A17B",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "Available: 1.2 ETH",
      apy: "3.95%",
      canBorrow: true,
      color: "#627EEA",
    },
  ]

  const borrowedAssets = [
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      balance: "500.00",
      apy: "5.2%",
      canBorrow: true,
      color: "#F5AC37",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      balance: "750.00",
      apy: "4.8%",
      canBorrow: true,
      color: "#26A17B",
    },
  ]

  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="container-custom main-content py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Borrow</h1>
          <p className="text-gray-400">Borrow assets against your collateral</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Borrowed" value="$1,250.00" icon={<DollarSign className="w-5 h-5 text-black" />} />
          <StatCard title="Average APY" value="5.0%" icon={<Percent className="w-5 h-5 text-black" />} />
          <StatCard
            title="Health Factor"
            value="2.1"
            icon={<AlertTriangle className="w-5 h-5 text-black" />}
            subtitle="Safe"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Current Borrows */}
          <div className="lg:col-span-2">
            <AssetTable
              title="Your Borrows"
              subtitle="Currently borrowed assets"
              assets={borrowedAssets}
              actionType="borrow"
            />
          </div>

          {/* Borrow Power */}
          <div>
            <BorrowPower percentage={68} borrowed="$1,250.00" available="$1,050.00" />
          </div>
        </div>

        {/* Available to Borrow */}
        <div>
          <AssetTable
            title="Assets to Borrow"
            subtitle="Available based on your collateral"
            assets={availableToBorrow}
            actionType="borrow"
          />
        </div>
      </main>
    </div>
  )
}
