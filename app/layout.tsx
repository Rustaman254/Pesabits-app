// app/layout.tsx
'use client';

import "./globals.css";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import web3AuthContextConfig from "@/lib/web3auth-config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <Web3AuthProvider config={web3AuthContextConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider>
              {children}
            </WagmiProvider>
          </QueryClientProvider>
        </Web3AuthProvider>
      </body>
    </html>
  );
}