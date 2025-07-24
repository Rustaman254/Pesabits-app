"use client"

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/ui/stat-card"
import { AssetTable } from "@/components/ui/asset-table"
import { DollarSign, Percent, TrendingUp } from "lucide-react"

import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export default function SupplyPage() {
  const availableAssets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "5,000.00",
      apy: "4.25%",
      canSupply: true,
      color: "#2775CA",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "10.0",
      apy: "3.15%",
      canSupply: true,
      color: "#627EEA",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      balance: "0.5",
      apy: "2.85%",
      canSupply: true,
      color: "#F7931A",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      balance: "2,500.00",
      apy: "3.95%",
      canSupply: true,
      color: "#F5AC37",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      balance: "100.0",
      apy: "2.45%",
      canSupply: true,
      color: "#375BD2",
    },
  ]

  const suppliedAssets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "1,250.00",
      apy: "4.25%",
      canWithdraw: true,
      color: "#2775CA",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "2.5",
      apy: "3.15%",
      canWithdraw: true,
      color: "#627EEA",
    },
  ]

  const { address } = useAccount()

  const { data, isLoading, error } = useBalance({ address })

  console.log("Balance data:", data)
  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />


      <main className="container-custom main-content py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Supply</h1>
          <p className="text-gray-400">Supply assets to earn interest and use as collateral</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Supplied" value="$8,250.00" icon={<DollarSign className="w-5 h-5 text-black" />} />
          <StatCard title="Average APY" value="3.7%" icon={<Percent className="w-5 h-5 text-black" />} />
          <StatCard title="Total Earned" value="$245.80" icon={<TrendingUp className="w-5 h-5 text-black" />} />
        </div>

        {/* Current Supplies */}
        <div className="mb-8">
          <AssetTable
            title="Your Supplies"
            subtitle="Earning interest and available as collateral"
            assets={suppliedAssets}
            actionType="withdraw"
          />
        </div>

        {/* Available to Supply */}
        <div>
          <AssetTable
            title="Assets to Supply"
            subtitle="Available in your wallet"
            assets={availableAssets}
            actionType="supply"
          />
        </div>
      </main>
    </div>
  )
}
