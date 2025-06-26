"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, CreditCard, Banknote, CheckCircle, Loader2, AlertTriangle } from "lucide-react"

interface BuyCryptoModalProps {
  asset: {
    symbol: string
    name: string
    price: number
    icon: string
    network?: string
  }
  paymentMethod: string
  onClose: () => void
}

export function BuyCryptoModal({ asset, paymentMethod, onClose }: BuyCryptoModalProps) {
  const [step, setStep] = useState(1) // 1: Amount, 2: Payment Details, 3: Review, 4: Processing, 5: Success
  const [fiatAmount, setFiatAmount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    bankAccount: "",
  })

  const fee = paymentMethod === "card" ? 0.035 : 0.01
  const fiatValue = Number.parseFloat(fiatAmount) || 0
  const feeAmount = fiatValue * fee
  const totalAmount = fiatValue + feeAmount
  const cryptoValue = fiatValue / asset.price

  const handleFiatChange = (value: string) => {
    setFiatAmount(value)
    const crypto = (Number.parseFloat(value) || 0) / asset.price
    setCryptoAmount(crypto.toFixed(6))
  }

  const handleCryptoChange = (value: string) => {
    setCryptoAmount(value)
    const fiat = (Number.parseFloat(value) || 0) * asset.price
    setFiatAmount(fiat.toFixed(2))
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePurchase = () => {
    setStep(4)
    // Simulate processing
    setTimeout(() => {
      setStep(5)
    }, 3000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-500 font-bold text-2xl">{asset.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
              <p className="text-gray-400">${asset.price.toLocaleString()}</p>
              {asset.network && (
                <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                  {asset.network}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fiat-amount" className="text-white">
                  Amount (USD)
                </Label>
                <Input
                  id="fiat-amount"
                  type="number"
                  placeholder="0.00"
                  value={fiatAmount}
                  onChange={(e) => handleFiatChange(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                />
              </div>

              <div className="text-center">
                <span className="text-gray-400">≈</span>
              </div>

              <div>
                <Label htmlFor="crypto-amount" className="text-white">
                  You'll receive ({asset.symbol})
                </Label>
                <Input
                  id="crypto-amount"
                  type="number"
                  placeholder="0.000000"
                  value={cryptoAmount}
                  onChange={(e) => handleCryptoChange(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                />
              </div>

              <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${fiatValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee ({(fee * 100).toFixed(1)}%)</span>
                  <span className="text-white">${feeAmount.toFixed(2)}</span>
                </div>
                <Separator className="bg-[#2A2A2A]" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">Payment Details</h3>
              <p className="text-gray-400">Enter your payment information</p>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number" className="text-white">
                    Card Number
                  </Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-white">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholder-name" className="text-white">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardholder-name"
                    placeholder="John Doe"
                    value={paymentDetails.name}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={paymentDetails.email}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="bank-account" className="text-white">
                    Bank Account
                  </Label>
                  <Input
                    id="bank-account"
                    placeholder="Account ending in 1234"
                    value={paymentDetails.bankAccount}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, bankAccount: e.target.value })}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">Review Purchase</h3>
              <p className="text-gray-400">Please review your order details</p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <span className="text-yellow-500 font-bold">{asset.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{asset.symbol}</p>
                    <p className="text-sm text-gray-400">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {cryptoAmount} {asset.symbol}
                  </p>
                  <p className="text-sm text-gray-400">${fiatValue.toFixed(2)}</p>
                </div>
              </div>

              <Separator className="bg-[#2A2A2A]" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-white flex items-center">
                    {paymentMethod === "card" ? (
                      <CreditCard className="w-4 h-4 mr-1" />
                    ) : (
                      <Banknote className="w-4 h-4 mr-1" />
                    )}
                    {paymentMethod === "card" ? "Credit Card" : "Bank Transfer"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Time</span>
                  <span className="text-white">{paymentMethod === "card" ? "Instant" : "1-3 days"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-white">${feeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#2A2A2A]">
                  <span className="text-white">Total</span>
                  <span className="text-white">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-500 font-medium">Important Notice</p>
                  <p className="text-sm text-gray-300 mt-1">
                    Cryptocurrency purchases are final and cannot be reversed. Please ensure all details are correct.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Processing Purchase</h3>
              <p className="text-gray-400 mt-2">Please wait while we process your transaction...</p>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <p className="text-sm text-gray-400">This may take a few moments. Do not close this window.</p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Purchase Successful!</h3>
              <p className="text-gray-400 mt-2">Your {asset.symbol} has been added to your wallet</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Purchased</span>
                  <span className="text-white font-semibold">
                    {cryptoAmount} {asset.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="text-white font-semibold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-sm">0x742d...C2f8</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">You can view your transaction history in your dashboard.</p>
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
              {step === 1 && "Buy Crypto"}
              {step === 2 && "Payment Details"}
              {step === 3 && "Review Order"}
              {step === 4 && "Processing"}
              {step === 5 && "Success"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          {step < 5 && (
            <div className="flex space-x-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-yellow-500" : "bg-[#2A2A2A]"}`} />
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="py-4">{renderStepContent()}</div>

        <div className="flex space-x-3">
          {step > 1 && step < 4 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
            >
              Back
            </Button>
          )}
          {step < 3 && (
            <Button
              onClick={handleNext}
              disabled={!fiatAmount || Number.parseFloat(fiatAmount) <= 0}
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600"
            >
              Continue
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handlePurchase} className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600">
              Confirm Purchase
            </Button>
          )}
          {step === 5 && (
            <Button onClick={onClose} className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600">
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
