"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, DollarSign, CheckCircle, Loader2, AlertTriangle, Calculator } from "lucide-react"

interface FiatEarningModalProps {
  strategy: {
    id: string
    currency: string
    apy: string
    risk: string
    minAmount: number
    lockPeriod: string
    collateral: string[]
    description: string
  }
  onClose: () => void
}

export function FiatEarningModal({ strategy, onClose }: FiatEarningModalProps) {
  const [step, setStep] = useState(1) // 1: Amount, 2: Review, 3: Processing, 4: Success
  const [collateralType, setCollateralType] = useState("")
  const [collateralAmount, setCollateralAmount] = useState("")
  const [projectedEarnings, setProjectedEarnings] = useState(0)

  const collateralPrices = {
    ETH: 2650,
    BTC: 43250,
    USDC: 1,
    USDT: 1,
  }

  const collateralValue = Number.parseFloat(collateralAmount) * (collateralPrices[collateralType] || 0)
  const annualEarnings = collateralValue * (Number.parseFloat(strategy.apy) / 100)
  const lockDays = Number.parseInt(strategy.lockPeriod.split(" ")[0])
  const periodEarnings = (annualEarnings * lockDays) / 365

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDeposit = () => {
    setStep(3)
    // Simulate processing
    setTimeout(() => {
      setStep(4)
    }, 3000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">{strategy.currency} Earning Strategy</h3>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  {strategy.apy} APY
                </Badge>
                <Badge
                  variant="outline"
                  className={`${
                    strategy.risk === "Low" ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                  }`}
                >
                  {strategy.risk} Risk
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="collateral-type" className="text-white">
                  Collateral Type
                </Label>
                <Select value={collateralType} onValueChange={setCollateralType}>
                  <SelectTrigger className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2">
                    <SelectValue placeholder="Select collateral" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    {strategy.collateral.map((asset) => (
                      <SelectItem key={asset} value={asset} className="text-white hover:bg-[#3A3A3A]">
                        {asset} - ${collateralPrices[asset]?.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="collateral-amount" className="text-white">
                  Collateral Amount {collateralType && `(${collateralType})`}
                </Label>
                <Input
                  id="collateral-amount"
                  type="number"
                  placeholder="0.00"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                />
                {collateralType && collateralAmount && (
                  <p className="text-sm text-gray-400 mt-1">≈ ${collateralValue.toLocaleString()} USD</p>
                )}
              </div>

              {collateralValue >= strategy.minAmount && (
                <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-yellow-500" />
                    <span className="text-white font-medium">Earnings Projection</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Lock Period</span>
                      <span className="text-white">{strategy.lockPeriod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Expected Earnings</span>
                      <span className="text-white">
                        {periodEarnings.toFixed(2)} {strategy.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Annual Rate</span>
                      <span className="text-white">{strategy.apy}</span>
                    </div>
                    <Separator className="bg-[#2A2A2A]" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Return</span>
                      <span className="text-green-500">
                        +{periodEarnings.toFixed(2)} {strategy.currency}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {collateralValue > 0 && collateralValue < strategy.minAmount && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-red-500 font-medium">Minimum Amount Required</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Minimum collateral value: ${strategy.minAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">Review Deposit</h3>
              <p className="text-gray-400">Please review your earning position details</p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{strategy.currency} Earning Strategy</p>
                  <p className="text-sm text-gray-400">{strategy.description}</p>
                </div>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  {strategy.apy} APY
                </Badge>
              </div>

              <Separator className="bg-[#2A2A2A]" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Collateral</span>
                  <span className="text-white">
                    {collateralAmount} {collateralType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Collateral Value</span>
                  <span className="text-white">${collateralValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lock Period</span>
                  <span className="text-white">{strategy.lockPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Level</span>
                  <span className={`${strategy.risk === "Low" ? "text-green-500" : "text-yellow-500"}`}>
                    {strategy.risk}
                  </span>
                </div>
                <Separator className="bg-[#2A2A2A]" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Expected Earnings</span>
                  <span className="text-green-500">
                    +{periodEarnings.toFixed(2)} {strategy.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-500 font-medium">Important Terms</p>
                  <ul className="text-sm text-gray-300 mt-1 space-y-1">
                    <li>• Your collateral will be locked for {strategy.lockPeriod}</li>
                    <li>• Earnings are paid in {strategy.currency} fiat currency</li>
                    <li>• Early withdrawal may incur penalties</li>
                    <li>• Returns are projected and not guaranteed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Processing Deposit</h3>
              <p className="text-gray-400 mt-2">Setting up your fiat earning position...</p>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <p className="text-sm text-gray-400">This may take a few moments. Do not close this window.</p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Position Created Successfully!</h3>
              <p className="text-gray-400 mt-2">Your fiat earning position is now active</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Strategy</span>
                  <span className="text-white font-semibold">{strategy.currency} Earning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Collateral Deposited</span>
                  <span className="text-white font-semibold">
                    {collateralAmount} {collateralType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expected Earnings</span>
                  <span className="text-green-500 font-semibold">
                    +{periodEarnings.toFixed(2)} {strategy.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position ID</span>
                  <span className="text-white font-mono text-sm">FE-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              You can track your earnings and manage your position in your dashboard.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">
              {step === 1 && "Earn Fiat"}
              {step === 2 && "Review Position"}
              {step === 3 && "Processing"}
              {step === 4 && "Success"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          {step < 4 && (
            <div className="flex space-x-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-yellow-500" : "bg-[#2A2A2A]"}`} />
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="py-4">{renderStepContent()}</div>

        <div className="flex space-x-3">
          {step > 1 && step < 3 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
            >
              Back
            </Button>
          )}
          {step === 1 && (
            <Button
              onClick={handleNext}
              disabled={!collateralType || !collateralAmount || collateralValue < strategy.minAmount}
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600"
            >
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleDeposit} className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600">
              Confirm Deposit
            </Button>
          )}
          {step === 4 && (
            <Button onClick={onClose} className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600">
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
