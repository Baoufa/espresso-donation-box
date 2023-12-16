import Main from "@/components/Main";
import { ABI, contractAddress } from "@/constants";
import { getContract, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const contract = getContract({
  address: contractAddress,
  abi: ABI,
  publicClient: client,
});

export async function Page() {
  const totalDonated = (await contract.read.getTotalDonations()) as
    | bigint
    | null;

  return <Main totalDonated={totalDonated} />;
}

export default Page;
