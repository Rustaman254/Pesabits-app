"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone } from "lucide-react"

export function BuyCryptoModal({ asset, paymentMethod, onClose }) {
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [step, setStep] = useState("input") // input, confirmation, success
  const [error, setError] = useState("")

  const feePercentage = paymentMethod === "mpesa" ? 0.02 : paymentMethod === "card" ? 0.035 : 0.01
  const amountNum = parseFloat(amount) || 0
  const fee = amountNum * feePercentage
  const total = amountNum + fee
  const cryptoAmount = amountNum / asset.price

  const handleConfirm = () => {
    if (paymentMethod === "mpesa") {
      if (!phoneNumber.match(/^\+?\d{10,12}$/)) {
        setError("Please enter a valid phone number")
        return
      }
    }
    if (amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }
    setError("")
    setStep("confirmation")
  }

  const handleSubmit = () => {
    // Simulate M-Pesa payment processing
    setStep("success")
  }

  const handleClose = () => {
    setStep("input")
    setAmount("")
    setPhoneNumber("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="bg-[#101010] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Buy {asset.name} ({asset.symbol})
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-400">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-[#1A1A1A] border-[#2A2A2A] text-white focus:border-yellow-500"
              />
              {amountNum > 0 && (
                <p className="text-sm text-gray-400">
                  You will receive ~{cryptoAmount.toFixed(6)} {asset.symbol}
                </p>
              )}
            </div>

            {paymentMethod === "mpesa" && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-400">M-Pesa Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254XXXXXXXXX"
                    className="bg-[#1A1A1A] border-[#2A2A2A] text-white focus:border-yellow-500 pl-10"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fee ({paymentMethod === "mpesa" ? "2.0%" : paymentMethod === "card" ? "3.5%" : "1.0%"})</span>
                <span className="text-white">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-400">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-[#2A2930] text-white border-[#2A2A2A] hover:bg-[#3A3940]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirmation" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Asset</span>
                <span className="text-white">{asset.name} ({asset.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white">${amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span className="text-white">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">You will receive</span>
                <span className="text-white">{cryptoAmount.toFixed(6)} {asset.symbol}</span>
              </div>
              {paymentMethod === "mpesa" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone Number</span>
                  <span className="text-white">{phoneNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white">{paymentMethods.find((m) => m.id === paymentMethod).name}</span>
              </div>
            </div>

            {paymentMethod === "mpesa" && (
              <p className="text-sm text-gray-400">
                You will receive a prompt on your phone to authorize the payment via M-Pesa.
              </p>
            )}

            <DialogFooter>
              <Button
                onClick={() => setStep("input")}
                variant="outline"
                className="bg-[#2A2930] text-white border-[#2A2A2A] hover:bg-[#3A3940]"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Confirm Payment
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <span className="text-yellow-500 font-bold text-2xl">{asset.icon}</span>
              </div>
            </div>
            <p className="text-white text-lg font-semibold">
              Purchase Successful!
            </p>
            <p className="text-gray-400">
              You have successfully purchased {cryptoAmount.toFixed(6)} {asset.symbol} for ${total.toFixed(2)}.
            </p>
            {paymentMethod === "mpesa" && (
              <p className="text-gray-400 text-sm">
                Check your M-Pesa transaction history for confirmation.
              </p>
            )}
            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
