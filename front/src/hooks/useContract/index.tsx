"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePublicClient, useFeeData, useWalletClient } from "wagmi";
import {
  GetContractResult,
  Hash,
  WalletClient,
  getContract,
} from "@wagmi/core";
import { ABI, CHAIN_ID, contractAddress } from "@/constants";
import { getDonation } from "./service";

function useContractHook() {
  const DONATE_GAS_COST = BigInt(35183);
  const publicClient = usePublicClient();
  const { data: feeData } = useFeeData({
    chainId: CHAIN_ID,
    cacheTime: 10_000,
  });
  const [totalDonationsInEth, setTotalDonationsInEth] = useState<bigint | null>(
    null
  );
  const [totalDonationsInUsd, setTotalDonationsInUSd] = useState<
    number | null
  >();
  const [totalDonationsIsLoading, setTotalDonationsIsLoading] = useState(true);
  const [totalDonationsError, setTotalDonationsError] = useState<Error | null>(
    null
  );
  const [donateIsLoading, setDonateIsLoading] = useState(false);
  const [donateError, setDonateError] = useState<Error | null>(null);
  const [donateTxHash, setDonateTxHash] = useState<Hash | null>(null);
  const [donateIsSuccess, setDonateIsSuccess] = useState(false);

  useWalletClient({
    onSuccess: (client) => {
      donationContract.current = getContract({
        address: contractAddress,
        abi: ABI,
        chainId: CHAIN_ID,
        walletClient: client as WalletClient,
      });
    },
  });

  const donationContract = useRef<GetContractResult<typeof ABI, WalletClient>>(
    getContract({
      address: contractAddress,
      abi: ABI,
      chainId: CHAIN_ID,
    })
  );

  async function donate(value: bigint) {
    setDonateIsLoading(true);
    try {
      await donationContract.current.simulate.donate({
        value: BigInt(value),
      });
      const hash = await donationContract.current.write.donate();
      setDonateTxHash(hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status == "reverted") {
        throw new Error("Transaction reverted");
      }
      setDonateIsSuccess(true);
    } catch (e: any) {
      setDonateTxHash(null);
      setDonateError(e);
    } finally {
      setDonateIsLoading(false);
    }
  }

  function getTotalDonations(): Promise<void> {
    setTotalDonationsIsLoading(true);
    return getDonation()
      .then((res) => {
        setTotalDonationsInEth(res.totalDonationInEth);
        setTotalDonationsInUSd(res.totalDonationInUsd);
      })
      .catch(setTotalDonationsError)
      .finally(() => setTotalDonationsIsLoading(false));
  }

  useEffect(() => {
    getTotalDonations();
    const unwatch = donationContract.current.watchEvent.DonationTransferred({
      onLogs: (logs) => {
        console.log("onLogs", logs);
        getTotalDonations();
      },
    });
    return () => {
      unwatch;
    };
  }, []);

  return {
    feeData,
    donateGasCost: DONATE_GAS_COST,
    donate,
    donateIsLoading,
    donateError,
    donateTxHash,
    donateIsSuccess,
    getTotalDonations,
    totalDonationsInEth,
    totalDonationsInUsd,
    totalDonationsIsLoading,
    totalDonationsError,
  };
}

type UseContractHook = ReturnType<typeof useContractHook>;
const ContractContext = createContext<UseContractHook | null>(null);

export default function useContract(): UseContractHook {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContractHook must be used within a ContractProvider");
  }
  return context;
}

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const hook = useContractHook();

  return (
    <ContractContext.Provider value={hook}>{children}</ContractContext.Provider>
  );
}
