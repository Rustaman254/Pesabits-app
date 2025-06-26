"use client"

import { useState } from "react"
import { Wallet, ChevronDown, ShoppingCart, PiggyBank, ArrowLeftRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Header() {
  const [isConnected, setIsConnected] = useState(true)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Supply", href: "/supply" },
    { name: "Borrow", href: "/borrow" },
    { name: "Markets", href: "/markets" },
  ]

  const moreItems = [
    { name: "Buy Crypto", href: "/buy-crypto", comingSoon: false, icon: ShoppingCart },
    { name: "Earn Fiat", href: "/earn-fiat", comingSoon: false, icon: PiggyBank },
    { name: "Swap", href: "/swap", comingSoon: true, icon: ArrowLeftRight },
    { name: "Dust Aggregator", href: "/dust-aggregator", comingSoon: true, icon: Layers },
  ]

  const connectWallet = () => {
    setIsConnected(true)
  }

  return (
    <header className="border-b border-[#2A2A2A] bg-[#060606]">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Beta Pill */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image src="/pesabits-logo.png" alt="PESABITS" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold text-white">PESABITS</span>
            </Link>
            <span className="bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full">Beta</span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-white"
                } py-4`}
              >
                {item.name}
              </Link>
            ))}
            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center py-4 ${
                  moreItems.some((item) => item.href === pathname)
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                More
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isMoreOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-[#101010] border border-[#2A2A2A] rounded-md shadow-lg z-10">
                  {moreItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm transition-colors ${
                        pathname === item.href
                          ? "text-yellow-500 bg-[#2A2930]"
                          : "text-gray-400 hover:text-white hover:bg-[#2A2930]"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-yellow-500" />
                      <span className="flex-1">{item.name}</span>
                      {item.comingSoon && (
                        <span className="bg-yellow-500 text-black text-xs font-semibold px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            {isConnected ? (
              <Button className="bg-[#2A2930] text-yellow-500 hover:bg-[#3A3940] border-none" variant="outline">
                <Wallet className="w-4 h-4 mr-2" />
                0x742d...C2f8
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={connectWallet} className="bg-yellow-500 text-black hover:bg-yellow-600">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
