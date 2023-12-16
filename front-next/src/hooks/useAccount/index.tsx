import { useEffect, useState } from "react";
import { useAccount as useWagmiAccount } from "wagmi";
import {
  Address,
  fetchEnsName,
  fetchBalance,
  FetchBalanceResult,
  Hash,
  FetchEnsNameResult,
} from "@wagmi/core";
import { CHAIN_ID } from "@/constants";

const cachedEns = new Map<Hash, FetchEnsNameResult>();

export function useAccount() {
  const [ens, setEns] = useState<FetchEnsNameResult | null>();
  const [ensLoading, setEnsLoading] = useState(true);
  const [ensError, setEnsError] = useState<Error | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<Error | null>(null);
  const [minifiedAddress, setMinifiedAddress] = useState<string | null>(null);
  const { address } = useWagmiAccount();

  function getEnsName(address: Address) {
    setEnsLoading(true);
    if (cachedEns.has(address)) {
      setEns(cachedEns.get(address));
      setEnsLoading(false);
      return;
    }
    fetchEnsName({
      address,
      chainId: 1,
    })
      .then((ens) => {
        setEns(ens);
        cachedEns.set(address, ens);
      })
      .catch(setEnsError)
      .finally(() => {
        setEnsLoading(false);
      });
  }

  function getAccountBalance(address: Address) {
    fetchBalance({
      address,
      chainId: CHAIN_ID,
    })
      .then((res: FetchBalanceResult) => setBalance(res.value))
      .catch(setBalanceError)
      .finally(() => {
        setBalanceLoading(false);
      });
  }

  function getMinified(address: Address) {
    const minified =
      address.toLowerCase().slice(0, 6) +
      "..." +
      address.toLowerCase().slice(-4);
    setMinifiedAddress(minified);
  }

  useEffect(() => {
    if (address) {
      getMinified(address);
      getEnsName(address);
      getAccountBalance(address);
    }
    if (!address) {
      setMinifiedAddress(null);
      setEns(null);
    }
  }, [address]);

  return {
    address,
    minifiedAddress,
    balance,
    balanceLoading,
    balanceError,
    ens,
    ensLoading,
    ensError,
  };
}
