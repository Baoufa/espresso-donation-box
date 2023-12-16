import { ABI, contractAddress } from "@/constants";
import { getContract, createPublicClient, http, defineChain } from "viem";
import { localhost, sepolia } from "viem/chains";

export const localFork = defineChain({
  ...sepolia,
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
});

export const client = createPublicClient({
  chain: localhost,
  transport: http(),
});

export const contract = getContract({
  address: contractAddress,
  abi: ABI,
  publicClient: client,
});
