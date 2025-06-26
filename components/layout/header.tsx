"use client"

import { useState } from "react"
import { Wallet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Header() {
  const [isConnected, setIsConnected] = useState(true)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Supply", href: "/supply" },
    { name: "Borrow", href: "/borrow" },
    { name: "Buy Crypto", href: "/buy-crypto" },
    { name: "Earn Fiat", href: "/earn-fiat" },
    { name: "Markets", href: "/markets" },
  ]

  const connectWallet = () => {
    setIsConnected(true)
  }

  return (
    <header className="border-b border-[#101010] bg-[#060606]">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image src="/pesabits-logo.png" alt="PESABITS" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">PESABITS</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`pb-2 border-b-2 transition-colors ${
                  pathname === item.href
                    ? "border-yellow-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
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
