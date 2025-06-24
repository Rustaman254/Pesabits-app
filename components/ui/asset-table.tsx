"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TransactionModal } from "./transaction-modal"
import { Check, X } from "lucide-react"

interface Asset {
  symbol: string
  name: string
  balance: string
  apy: string
  collateral?: boolean
  canSupply?: boolean
  canBorrow?: boolean
  canWithdraw?: boolean
  color: string
}

interface AssetTableProps {
  title: string
  subtitle?: string
  assets: Asset[]
  showCollateral?: boolean
  showActions?: boolean
  actionType?: "supply" | "borrow" | "withdraw"
}

export function AssetTable({
  title,
  subtitle,
  assets = [],
  showCollateral = false,
  showActions = true,
  actionType = "supply",
}: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [modalType, setModalType] = useState<"supply" | "withdraw" | "borrow" | "repay">("supply")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAction = (asset: Asset, type: "supply" | "withdraw" | "borrow" | "repay") => {
    if (!asset) return
    setSelectedAsset(asset)
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-[#101010] rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 pb-2 border-b border-gray-800">
            <div>Asset</div>
            <div>Balance</div>
            <div>APY</div>
            <div>{showCollateral ? "Collateral" : "Actions"}</div>
          </div>

          {assets.map((asset, index) => (
            <div key={`${asset.symbol}-${index}`} className="grid grid-cols-4 gap-4 items-center py-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white`}
                  style={{ backgroundColor: asset.color || "#666" }}
                >
                  {asset.symbol?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="font-medium text-white">{asset.symbol || ""}</div>
                  <div className="text-xs text-gray-400">{asset.name || ""}</div>
                </div>
              </div>
              <div className="text-white">{asset.balance || "0"}</div>
              <div className="text-green-400">{asset.apy || "0%"}</div>
              <div className="flex items-center space-x-2">
                {showCollateral && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center">
                    {asset.collateral ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )}
                {showActions && (
                  <div className="flex space-x-2">
                    {actionType === "supply" && asset.canSupply && (
                      <Button
                        size="sm"
                        className="bg-yellow-500 text-black hover:bg-yellow-600"
                        onClick={() => handleAction(asset, "supply")}
                      >
                        Supply
                      </Button>
                    )}
                    {actionType === "borrow" && asset.canBorrow && (
                      <Button
                        size="sm"
                        className="bg-yellow-500 text-black hover:bg-yellow-600"
                        onClick={() => handleAction(asset, "borrow")}
                      >
                        Borrow
                      </Button>
                    )}
                    {actionType === "withdraw" && asset.canWithdraw && (
                      <Button
                        size="sm"
                        className="bg-[#2A2A2A] text-white hover:bg-gray-700 border-none"
                        onClick={() => handleAction(asset, "withdraw")}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAsset && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          asset={selectedAsset}
        />
      )}
    </>
  )
}
