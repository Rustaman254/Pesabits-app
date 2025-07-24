"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { TransactionModal } from "@/components/ui/transaction-modal"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

export default function MarketsPage() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [modalType, setModalType] = useState<"supply" | "withdraw" | "borrow" | "repay">("supply")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const markets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      totalSupply: "$125.5M",
      supplyAPY: "4.25%",
      totalBorrow: "$89.2M",
      borrowAPY: "5.25%",
      color: "#2775CA",
      trend: "up",
      balance: "5,000.00",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      totalSupply: "$98.7M",
      supplyAPY: "3.15%",
      totalBorrow: "$67.4M",
      borrowAPY: "3.95%",
      color: "#627EEA",
      trend: "up",
      balance: "10.0",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      totalSupply: "$76.3M",
      supplyAPY: "2.85%",
      totalBorrow: "$45.1M",
      borrowAPY: "3.65%",
      color: "#F7931A",
      trend: "down",
      balance: "0.5",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      totalSupply: "$54.2M",
      supplyAPY: "3.95%",
      totalBorrow: "$38.7M",
      borrowAPY: "5.2%",
      color: "#F5AC37",
      trend: "up",
      balance: "2,500.00",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      totalSupply: "$32.1M",
      supplyAPY: "2.45%",
      totalBorrow: "$18.9M",
      borrowAPY: "3.25%",
      color: "#375BD2",
      trend: "up",
      balance: "100.0",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      totalSupply: "$87.6M",
      supplyAPY: "4.15%",
      totalBorrow: "$62.3M",
      borrowAPY: "4.8%",
      color: "#26A17B",
      trend: "down",
      balance: "1,000.00",
    },
  ]

  const handleAction = (market: any, type: "supply" | "borrow") => {
    if (!market) return

    setSelectedAsset({
      symbol: market.symbol || "",
      name: market.name || "",
      balance: market.balance || "0",
      apy: type === "supply" ? market.supplyAPY || "0%" : market.borrowAPY || "0%",
      color: market.color || "#666",
    })
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="container-custom main-content py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Markets</h1>
          <p className="text-gray-400">Overview of all available lending and borrowing markets</p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Total Market Size</h3>
            <div className="text-3xl font-bold text-yellow-500">$474.4M</div>
            <div className="text-sm text-gray-400 mt-1">Across all markets</div>
          </div>

          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Total Borrowed</h3>
            <div className="text-3xl font-bold text-yellow-500">$321.6M</div>
            <div className="text-sm text-gray-400 mt-1">67.8% utilization</div>
          </div>

          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Active Users</h3>
            <div className="text-3xl font-bold text-yellow-500">12,847</div>
            <div className="text-sm text-gray-400 mt-1">+5.2% this week</div>
          </div>
        </div>

        {/* Markets Table */}
        <div className="bg-[#101010] rounded-xl card-shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">All Markets</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 text-gray-400 font-medium">Asset</th>
                    <th className="text-right py-4 text-gray-400 font-medium">Total Supply</th>
                    <th className="text-right py-4 text-gray-400 font-medium">Supply APY</th>
                    <th className="text-right py-4 text-gray-400 font-medium">Total Borrow</th>
                    <th className="text-right py-4 text-gray-400 font-medium">Borrow APY</th>
                    <th className="text-right py-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.symbol}-${index}`}
                      className="border-b border-gray-800 hover:bg-[#0A0A0A] transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: market.color || "#666" }}
                          >
                            {market.symbol?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-medium text-white">{market.symbol || ""}</div>
                            <div className="text-sm text-gray-400">{market.name || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-4 text-white font-medium">{market.totalSupply || ""}</td>
                      <td className="text-right py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-green-400 font-medium">{market.supplyAPY || ""}</span>
                          {market.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="text-right py-4 text-white font-medium">{market.totalBorrow || ""}</td>
                      <td className="text-right py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-yellow-400 font-medium">{market.borrowAPY || ""}</span>
                          {market.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="text-right py-4">
                        <div className="flex space-x-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-yellow-500 text-black hover:bg-yellow-600"
                            onClick={() => handleAction(market, "supply")}
                          >
                            Supply
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#2A2A2A] text-white hover:bg-gray-700 border-none"
                            onClick={() => handleAction(market, "borrow")}
                          >
                            Borrow
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Total Market Size</h3>
            <div className="text-3xl font-bold text-yellow-500">$474.4M</div>
            <div className="text-sm text-gray-400 mt-1">Across all markets</div>
          </div>

          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Total Borrowed</h3>
            <div className="text-3xl font-bold text-yellow-500">$321.6M</div>
            <div className="text-sm text-gray-400 mt-1">67.8% utilization</div>
          </div>

          <div className="bg-[#101010] rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-white mb-2">Active Users</h3>
            <div className="text-3xl font-bold text-yellow-500">12,847</div>
            <div className="text-sm text-gray-400 mt-1">+5.2% this week</div>
          </div>
        </div> */}
      </main>

      {selectedAsset && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          asset={selectedAsset}
        />
      )}
    </div>
  )
}
