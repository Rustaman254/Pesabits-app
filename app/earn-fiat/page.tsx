"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Shield, Zap } from "lucide-react"
import { FiatEarningModal } from "@/components/ui/fiat-earning-modal"

const fiatStrategies = [
  {
    id: "usd-stable",
    currency: "USD",
    apy: "8.5%",
    risk: "Low",
    minAmount: 1000,
    lockPeriod: "30 days",
    collateral: ["ETH", "BTC", "USDC"],
    description: "Earn stable USD returns backed by diversified DeFi protocols",
    totalDeposits: 12500000,
    capacity: 50000000,
  },
  {
    id: "eur-growth",
    currency: "EUR",
    apy: "12.3%",
    risk: "Medium",
    minAmount: 2000,
    lockPeriod: "60 days",
    collateral: ["ETH", "BTC", "USDT"],
    description: "Higher yield EUR strategy with institutional partnerships",
    totalDeposits: 8750000,
    capacity: 25000000,
  },
  {
    id: "gbp-premium",
    currency: "GBP",
    apy: "15.7%",
    risk: "Medium",
    minAmount: 5000,
    lockPeriod: "90 days",
    collateral: ["ETH", "BTC"],
    description: "Premium GBP yields through advanced trading strategies",
    totalDeposits: 4200000,
    capacity: 15000000,
  },
]

const userPositions = [
  {
    id: 1,
    strategy: "USD Stable",
    collateral: "2.5 ETH",
    fiatEarned: "1,247.50",
    currency: "USD",
    apy: "8.5%",
    daysLeft: 12,
    status: "Active",
  },
  {
    id: 2,
    strategy: "EUR Growth",
    collateral: "0.8 BTC",
    fiatEarned: "892.30",
    currency: "EUR",
    apy: "12.3%",
    daysLeft: 45,
    status: "Active",
  },
]

export default function EarnFiatPage() {
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleEarnFiat = (strategy) => {
    setSelectedStrategy(strategy)
    setShowModal(true)
  }

  const totalFiatEarned = userPositions.reduce(
    (sum, pos) => sum + Number.parseFloat(pos.fiatEarned.replace(",", "")),
    0,
  )
  const averageAPY = userPositions.reduce((sum, pos) => sum + Number.parseFloat(pos.apy), 0) / userPositions.length

  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <div className="container-custom main-content">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Earn Fiat</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Use your crypto as collateral to earn stable fiat currency returns. Professional yield strategies with
              institutional-grade security.
            </p>
          </div>

          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Fiat Earned</p>
                    <p className="text-2xl font-bold text-white">${totalFiatEarned.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Average APY</p>
                    <p className="text-2xl font-bold text-white">{averageAPY.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Shield className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Active Positions</p>
                    <p className="text-2xl font-bold text-white">{userPositions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Collateral Value</p>
                    <p className="text-2xl font-bold text-white">$45,230</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Positions */}
          {userPositions.length > 0 && (
            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Your Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPositions.map((position) => (
                    <div key={position.id} className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-yellow-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{position.strategy}</h3>
                            <p className="text-sm text-gray-400">Collateral: {position.collateral}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            {position.fiatEarned} {position.currency}
                          </p>
                          <p className="text-sm text-green-500">{position.apy} APY</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Time remaining</span>
                          <span>{position.daysLeft} days</span>
                        </div>
                        <Progress value={((90 - position.daysLeft) / 90) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fiat Earning Strategies */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Available Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fiatStrategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className="bg-[#101010] border-[#2A2A2A] hover:border-yellow-500/50 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{strategy.currency} Strategy</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${
                          strategy.risk === "Low"
                            ? "border-green-500 text-green-500"
                            : "border-yellow-500 text-yellow-500"
                        }`}
                      >
                        {strategy.risk} Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-500">{strategy.apy}</p>
                      <p className="text-sm text-gray-400">Annual Percentage Yield</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Min Amount</span>
                        <span className="text-white">${strategy.minAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Lock Period</span>
                        <span className="text-white">{strategy.lockPeriod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Collateral</span>
                        <span className="text-white">{strategy.collateral.join(", ")}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Capacity</span>
                        <span className="text-white">
                          ${(strategy.totalDeposits / 1000000).toFixed(1)}M / $
                          {(strategy.capacity / 1000000).toFixed(0)}M
                        </span>
                      </div>
                      <Progress value={(strategy.totalDeposits / strategy.capacity) * 100} className="h-2" />
                    </div>

                    <p className="text-sm text-gray-400">{strategy.description}</p>

                    <Button
                      onClick={() => handleEarnFiat(strategy)}
                      className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                    >
                      Start Earning {strategy.currency}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <Card className="bg-[#101010] border-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-white">How Fiat Earning Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Deposit Collateral</h3>
                  <p className="text-gray-400">
                    Deposit your crypto assets as collateral. Your assets remain yours and are secured by smart
                    contracts.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Earn Fiat Returns</h3>
                  <p className="text-gray-400">
                    Our institutional strategies generate stable fiat returns while your crypto collateral appreciates.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Withdraw Anytime</h3>
                  <p className="text-gray-400">
                    Access your fiat earnings and withdraw your collateral at any time after the lock period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && selectedStrategy && (
        <FiatEarningModal strategy={selectedStrategy} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
