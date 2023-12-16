"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { useState, useEffect } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { localFork } from "@/hooks/useContract/contract";

const { chains, publicClient } = configureChains(
  [mainnet, localFork],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Espresso Donation Box",
  projectId: "716d4c812e75bbfd709e56d9e39a6fc6",
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
