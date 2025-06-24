"use client"

import { useState } from "react"
import { X, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "supply" | "withdraw" | "borrow" | "repay"
  asset: {
    symbol: string
    name: string
    balance: string
    apy: string
    color: string
  }
}

export function TransactionModal({ isOpen, onClose, type, asset }: TransactionModalProps) {
  const [amount, setAmount] = useState("")
  const [leverage, setLeverage] = useState([1])
  const [step, setStep] = useState(1) // 1: Input, 2: Processing, 3: Success

  if (!isOpen) return null

  const handleTransaction = async () => {
    setStep(2)
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setStep(3)
    setTimeout(() => {
      setStep(1)
      onClose()
      setAmount("")
    }, 3000)
  }

  const getTitle = () => {
    switch (type) {
      case "supply":
        return `Supply ${asset?.symbol || ""}`
      case "withdraw":
        return `Withdraw ${asset?.symbol || ""}`
      case "borrow":
        return `Leverage ${asset?.symbol || ""}`
      case "repay":
        return `Repay ${asset?.symbol || ""}`
      default:
        return "Transaction"
    }
  }

  const getActionText = () => {
    switch (type) {
      case "supply":
        return "Supplied"
      case "withdraw":
        return "Withdrew"
      case "borrow":
        return "Leveraged"
      case "repay":
        return "Repaid"
      default:
        return "Processed"
    }
  }

  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-md border border-gray-800 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">All done!</h2>
          <p className="text-gray-400 mb-6">
            You {getActionText()} {amount || "0"} {asset?.symbol || ""}
          </p>

          <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-[#2A2A2A] rounded-lg">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-300">
              Add token to the wallet to track your {asset?.symbol || ""} balance.
            </span>
            <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600 text-xs px-3 py-1">
              Add to wallet
            </Button>
          </div>

          <Button onClick={onClose} className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold">
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-md border border-gray-800 text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-white mb-2">Processing...</h2>
          <p className="text-gray-400 mb-6">Please confirm the transaction in your wallet</p>

          <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Network</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-white">Eth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-md border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-white">Amount</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold bg-[#2A2A2A] border-gray-700 text-white h-14 pr-20"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: asset?.color || "#666" }}
              >
                {asset?.symbol?.charAt(0) || "?"}
              </div>
              <span className="text-white font-medium">{asset?.symbol || ""}</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">~$0.01</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">
                Balance: {asset?.balance || "0"} {asset?.symbol || ""}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAmount(asset?.balance || "0")}
                className="text-yellow-500 hover:text-yellow-400 text-xs px-2 py-1 h-auto"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        {/* Leverage Slider for Borrow */}
        {type === "borrow" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-white">Leverage</label>
              <span className="text-white font-bold">{leverage[0]}x</span>
            </div>
            <Slider value={leverage} onValueChange={setLeverage} max={5} min={1} step={0.1} className="mb-2" />
            <div className="text-xs text-gray-400">Your addition exposure: 0.3864249</div>
          </div>
        )}

        {/* Transaction Overview */}
        <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Transaction overview</h3>
          <div className="space-y-2 text-sm">
            {type === "withdraw" && (
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining supply</span>
                <span className="text-white">10.022</span>
              </div>
            )}
            {type === "borrow" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply APY</span>
                  <span className="text-white">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Yield APR</span>
                  <span className="text-white">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MAHA APR</span>
                  <span className="text-white">0%</span>
                </div>
              </>
            )}
            {type === "repay" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Remaining debt</span>
                  <span className="text-white">
                    110 ARTH → <span className="text-green-400">0 ARTH</span>
                  </span>
                </div>
                <div className="text-xs text-gray-500">~$120 → $120</div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Health factor</span>
                  <span className="text-white">
                    240.73 → <span className="text-green-400">164.878</span>
                  </span>
                </div>
                <div className="text-xs text-gray-500">Liquidation at &lt;10</div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-gray-400 text-sm">$0.02</span>
              <Info className="h-3 w-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {type === "repay" ? (
          <div className="space-y-3">
            <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold h-12">
              Approve to continue
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold h-12"
            >
              Repay {asset?.symbol || ""}
            </Button>
          </div>
        ) : (
          <>
            {amount ? (
              <Button
                onClick={handleTransaction}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold h-12"
              >
                {type === "supply"
                  ? "Supply"
                  : type === "withdraw"
                    ? "Withdraw"
                    : type === "borrow"
                      ? "Leverage"
                      : "Repay"}{" "}
                {asset?.symbol || ""}
              </Button>
            ) : (
              <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed font-semibold h-12">
                Enter an amount
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
