"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, TrendingUp, Shield, Clock } from "lucide-react"
import { BuyCryptoModal } from "@/components/ui/buy-crypto-modal"

const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.0,
    change: "+2.45%",
    icon: "₿",
    category: "crypto",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2650.0,
    change: "+1.85%",
    icon: "Ξ",
    category: "crypto",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.5,
    change: "+5.20%",
    icon: "◎",
    category: "crypto",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.85,
    change: "+3.15%",
    icon: "⬟",
    category: "gas",
  },
]

const stablecoins = [
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change: "0.00%",
    icon: "$",
    category: "stable",
  },
  {
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    change: "+0.01%",
    icon: "₮",
    category: "stable",
  },
  {
    symbol: "DAI",
    name: "Dai",
    price: 1.0,
    change: "-0.01%",
    icon: "◈",
    category: "stable",
  },
]

const gasTokens = [
  {
    symbol: "ETH",
    name: "Ethereum Gas",
    price: 2650.0,
    change: "+1.85%",
    icon: "Ξ",
    category: "gas",
    network: "Ethereum",
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 315.5,
    change: "+2.10%",
    icon: "⬢",
    category: "gas",
    network: "BSC",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 38.75,
    change: "+4.25%",
    icon: "▲",
    category: "gas",
    network: "Avalanche",
  },
]

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    fee: "3.5%",
    time: "Instant",
    limits: "$50 - $10,000",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Banknote,
    fee: "1.0%",
    time: "1-3 days",
    limits: "$100 - $50,000",
  },
]

export default function BuyCryptoPage() {
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("crypto")

  const handleBuy = (asset) => {
    setSelectedAsset(asset)
    setShowModal(true)
  }

  const getCurrentAssets = () => {
    switch (activeTab) {
      case "crypto":
        return cryptoAssets
      case "stable":
        return stablecoins
      case "gas":
        return gasTokens
      default:
        return cryptoAssets
    }
  }

  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <div className="container-custom main-content">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Buy Crypto</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Purchase cryptocurrencies, stablecoins, and gas tokens with ease. Secure, fast, and reliable crypto
              purchases.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Shield className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Security</p>
                    <p className="text-xl font-semibold text-white">Bank-Grade</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#101010] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Processing</p>
                    <p className="text-xl font-semibold text-white">Instant</p>
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
                    <p className="text-sm text-gray-400">Assets</p>
                    <p className="text-xl font-semibold text-white">50+ Tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Asset Selection */}
            <div className="lg:col-span-2">
              <Card className="bg-[#101010] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Select Asset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 bg-[#2A2A2A]">
                      <TabsTrigger
                        value="crypto"
                        className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                      >
                        Cryptocurrencies
                      </TabsTrigger>
                      <TabsTrigger
                        value="stable"
                        className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                      >
                        Stablecoins
                      </TabsTrigger>
                      <TabsTrigger
                        value="gas"
                        className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                      >
                        Gas Tokens
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4">
                      <div className="grid gap-4">
                        {getCurrentAssets().map((asset) => (
                          <div
                            key={asset.symbol}
                            className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] hover:border-yellow-500/50 transition-colors cursor-pointer"
                            onClick={() => handleBuy(asset)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                                <span className="text-yellow-500 font-bold text-lg">{asset.icon}</span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-white">{asset.symbol}</h3>
                                  {asset.network && (
                                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                      {asset.network}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{asset.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">${asset.price.toLocaleString()}</p>
                              <p
                                className={`text-sm ${asset.change.startsWith("+") ? "text-green-500" : asset.change.startsWith("-") ? "text-red-500" : "text-gray-400"}`}
                              >
                                {asset.change}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Summary */}
            <div className="space-y-6">
              <Card className="bg-[#101010] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-[#2A2A2A] hover:border-yellow-500/50"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className="w-5 h-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="font-medium text-white">{method.name}</p>
                          <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>Fee: {method.fee}</span>
                            <span>{method.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{method.limits}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#101010] border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-white">How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="text-white font-medium">Select Asset</p>
                        <p className="text-sm text-gray-400">Choose from crypto, stablecoins, or gas tokens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-white font-medium">Enter Amount</p>
                        <p className="text-sm text-gray-400">Specify how much you want to purchase</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="text-white font-medium">Complete Payment</p>
                        <p className="text-sm text-gray-400">Pay securely and receive tokens instantly</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedAsset && (
        <BuyCryptoModal asset={selectedAsset} paymentMethod={paymentMethod} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
