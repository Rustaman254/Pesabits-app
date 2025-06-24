"use client"

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/ui/stat-card"
import { AssetTable } from "@/components/ui/asset-table"
import { BorrowPower } from "@/components/ui/borrow-power"
import { DollarSign, Percent, Shield, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const supplyAssets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "1,250.00",
      apy: "4.25%",
      collateral: true,
      canWithdraw: true,
      color: "#2775CA",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "2.5",
      apy: "3.15%",
      collateral: true,
      canWithdraw: true,
      color: "#627EEA",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      balance: "0.05",
      apy: "2.85%",
      collateral: true,
      canWithdraw: true,
      color: "#F7931A",
    },
  ]

  const borrowAssets = [
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
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your multichain lending and borrowing positions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Net Worth" value="$12,450.00" icon={<DollarSign className="w-5 h-5 text-black" />} />
          <StatCard title="Net APY" value="3.2%" icon={<Percent className="w-5 h-5 text-black" />} />
          <StatCard
            title="Health Factor"
            value="2.1"
            icon={<Shield className="w-5 h-5 text-black" />}
            subtitle="Safe"
          />
          <StatCard title="Total Earned" value="$245.80" icon={<TrendingUp className="w-5 h-5 text-black" />} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Supply Assets */}
          <div className="lg:col-span-2">
            <AssetTable
              title="Your Supplies"
              subtitle="Total Supply: $8,250.00"
              assets={supplyAssets}
              showCollateral={true}
              actionType="withdraw"
            />
          </div>

          {/* Borrow Power */}
          <div>
            <BorrowPower percentage={68} borrowed="$2,100.00" available="$1,050.00" />
          </div>
        </div>

        {/* Borrow Assets */}
        <div className="mt-8">
          <AssetTable
            title="Your Borrows"
            subtitle="Total Borrowed: $1,250.00"
            assets={borrowAssets}
            actionType="borrow"
          />
        </div>
      </main>
    </div>
  )
}
