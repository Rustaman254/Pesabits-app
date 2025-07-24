"use client"

import { useState, useEffect } from "react"
import { Wallet, ChevronDown, ShoppingCart, PiggyBank, ArrowLeftRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react"
import { useAccount } from "wagmi"

export function Header() {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false)
  const [randomUsername, setRandomUsername] = useState("")
  const [randomProfilePic, setRandomProfilePic] = useState("")
  const pathname = usePathname()

  // Web3Auth hooks
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect()
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect()
  const { userInfo } = useWeb3AuthUser()
  const { address } = useAccount()

  // Random usernames and profile pictures
  const usernames = [
    "CryptoVoyager",
    "BlockChainNinja",
    "Web3Wanderer",
    "DeFiDreamer",
    "NFTNomad",
    "TokenTitan",
    "WalletWizard",
    "EtherExplorer"
  ]

  const profilePics = [
    "https://avatars.githubusercontent.com/u/215288113?v=4&size=64",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAOVBMVEXw8PDgt5Lx8/Xt5d7jwaTfs4zs4tvjxKniv6Dt5+HfsorftY7jwqbesIXlyrPv7uzhuZbp2szy9vp3fs+8AAAB70lEQVR4nO3dS04DQRBEwcEew/hvuP9hYcuKaqnaJCjeAWoy1ljNskiSJEmSpH/afd/XvfLBY9/3jiXh/nro6vpa+N5uPXV977TtSsLDS1eHkvDt3PW980pIOBoh4WiEhOMREo5GSDgeIeFohITjERKORkg4HiHhaISE4xESjkZIOB5htvBc6FQSXiqnni98XNaf2/YV4a1wad2eLTxfPnaFKt9bKod2x9KqTmHtVl+dqwgJ50RIOOtWX4SEs271RUg461ZfhISzbvVFSDjrVl+EhLNu9UVIOOtWX4SEs271RUg461ZfhISzbvVF+EvC2gMUpaceQoWlByhqTz2kCiNPhc4iJMyfRUiYP4uQMH8WIWH+LELC/FmEhPmzCAnzZxES5s8iJMyfRUiYP4uQMH/W84WlFwdqzwQ0nmoUvjzeCq2l5yz6TrUKSy9/FB8taTvVK0yMkDA/QsL8CAnzIyTMj5AwP0LC/AgJ8yMkzI+QMD9CwvwICfMjHBMWXks4FP+O33aqVbjtX3/uvbSr79TTfzHU+COY1P/gkXkqdBYhYf4sQsL8WYSE+bMICfNnERLmzyIkzJ9FSJg/i5AwfxYhYf4sQsL8WYSE326dKg8A1GZFnlqO21roVrmVeWpZCu9wfPWHT0mSJEmS9A/7BOm0m/ApHeQrAAAAAElFTkSuQmCC"
  ]

  // Select random username and profile picture on wallet connection (including MetaMask)
  useEffect(() => {
    if (isConnected && address) {
      const randomUserIndex = Math.floor(Math.random() * usernames.length)
      const randomPicIndex = Math.floor(Math.random() * profilePics.length)
      setRandomUsername(usernames[randomUserIndex])
      setRandomProfilePic(profilePics[randomPicIndex])
    }
  }, [isConnected, address])

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

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p")
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2)
      console.log(...args)
    }
  }

  const handleConnectWallet = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await disconnect()
      setIsWalletDropdownOpen(false)
      setRandomUsername("")
      setRandomProfilePic("")
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  return (
    <header className="border-[#2A2A2A] bg-[#060606]">
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
                <div className="absolute top-full left-0 mt-0 w-64 bg-[#101010] rounded-md shadow-lg z-10">
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
              <div
                className="relative"
                onMouseEnter={() => setIsWalletDropdownOpen(true)}
                onMouseLeave={() => setIsWalletDropdownOpen(false)}
              >
                <div className="flex items-center bg-[#2A2930] hover:bg-[#3A3940] rounded-full py-2 pl-2 pr-3 transition-colors">
                  {randomProfilePic && (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden mr-2">
                      <Image src={randomProfilePic} alt="Profile" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-yellow-500 text-sm font-medium">{randomUsername || "Connected"}</span>
                    {address && (
                      <span className="text-gray-500 text-xs font-mono">{formatAddress(address)}</span>
                    )}
                  </div>
                  <Wallet className="w-4 h-4 ml-2 text-yellow-500" />
                  <ChevronDown className="ml-1 h-4 w-4 text-yellow-500" />
                </div>
                
                {/* Wallet Dropdown */}
                {isWalletDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-72 bg-[#101010] rounded-md shadow-lg z-50">
                    <div className="p-4 border-b border-[#2A2A2A]">
                      <div className="flex items-center space-x-3 mb-2">
                        {randomProfilePic && (
                          <div className="w-10 h-10 relative rounded-full overflow-hidden">
                            <Image src={randomProfilePic} alt="Profile" fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-white font-medium">{randomUsername}</div>
                          {address && (
                            <div className="text-xs text-gray-500 font-mono">{formatAddress(address)}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Connected to</div>
                      <div className="text-white font-medium">{connectorName}</div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => uiConsole(userInfo)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2A2930] rounded transition-colors"
                      >
                        View User Info
                      </button>
                      
                      <button
                        onClick={handleDisconnectWallet}
                        disabled={disconnectLoading}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#2A2930] rounded transition-colors disabled:opacity-50"
                      >
                        {disconnectLoading ? "Disconnecting..." : "Disconnect"}
                      </button>
                    </div>

                    {/* Error Display */}
                    {disconnectError && (
                      <div className="p-3 border-t border-[#2A2A2A]">
                        <div className="text-xs text-red-400">{disconnectError.message}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <Button 
                  onClick={handleConnectWallet} 
                  className="bg-yellow-500 text-black hover:bg-yellow-600 rounded-full"
                  disabled={connectLoading}
                >
                  {connectLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
                
                {/* Error Display */}
                {connectError && (
                  <div className="absolute top-full mt-1 right-0 bg-red-900/20 border border-red-500/20 rounded-md p-2 min-w-64">
                    <div className="text-xs text-red-400">{connectError.message}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden console for debugging */}
      <div id="console" className="hidden">
        <p></p>
      </div>
    </header>
  )
}