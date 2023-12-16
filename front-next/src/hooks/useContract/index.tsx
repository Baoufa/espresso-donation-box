import { useEffect, useRef, useState } from "react";
import { usePublicClient, useFeeData, useWalletClient } from "wagmi";
import {
  GetContractResult,
  Hash,
  WalletClient,
  getContract,
} from "@wagmi/core";
import { ABI, CHAIN_ID, contractAddress } from "@/constants";
import { createWalletClient, formatEther, http } from "viem";
import { localFork } from "./contract";

export default function useContract() {
  const publicClient = usePublicClient();
  const { data: feeData } = useFeeData({
    chainId: CHAIN_ID,
    cacheTime: 10_000,
  });
  const DONATE_GAS_COST = BigInt(35183);

  const [totalDonations, setTotalDonations] = useState<bigint | null>(null);
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

  // LOCAL WALLET CLIENT
  const client = createWalletClient({
    chain: localFork,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    transport: http(),
  });

  const donationContract = useRef<GetContractResult<typeof ABI, WalletClient>>(
    getContract({
      address: contractAddress,
      abi: ABI,
      chainId: CHAIN_ID,
      walletClient: client,
    })
  );

  async function donate(value: bigint) {
    setDonateIsLoading(true);
    try {
      await donationContract.current.simulate.donate({
        value: BigInt(1),
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
    return donationContract.current.read
      .getTotalDonations()
      .then((res) => setTotalDonations(res as bigint))
      .catch(setTotalDonationsError)
      .finally(() => setTotalDonationsIsLoading(false));
  }

  useEffect(() => {
    if (!donationContract) return;

    getTotalDonations();
    const timeout = setInterval(getTotalDonations, 10000);
    const unwatch = donationContract.current.watchEvent.DonationTransferred({
      onLogs: (logs) => {
        console.log(logs);
        getTotalDonations();
      },
    });

    return () => {
      clearTimeout(timeout);
      unwatch();
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
    totalDonations,
    totalDonationsIsLoading,
    totalDonationsError,
  };
}
