"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (wallet: string) => void
}

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null

  const wallets = [
    {
      name: "Metamask",
      icon: "🦊",
      id: "metamask",
    },
    {
      name: "Wallet connect",
      icon: "🔗",
      id: "walletconnect",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-md border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect a wallet</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3 mb-6">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => onConnect(wallet.id)}
              className="w-full bg-[#2A2A2A] hover:bg-gray-700 text-white border-none justify-start h-14"
              variant="outline"
            >
              <span className="text-2xl mr-4">{wallet.icon}</span>
              <span className="font-medium">{wallet.name}</span>
            </Button>
          ))}
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-400 text-center">
          Need help connecting a wallet? Read our{" "}
          <a href="#" className="text-yellow-500 hover:text-yellow-400">
            FAQ
          </a>
        </p>
      </div>
    </div>
  )
}
