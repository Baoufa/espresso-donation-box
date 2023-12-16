"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Espresso Donation Box",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

interface WagmiProviderProps {
  children: React.ReactNode;
}

export default function WagmiProvider({ children }: WagmiProviderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
