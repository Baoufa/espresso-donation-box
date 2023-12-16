import Main from "@/components/Main";

// const client = createPublicClient({
//   chain: sepolia,
//   transport: http(),
// });

// export const contract = getContract({
//   address: contractAddress,
//   abi: ABI,
//   publicClient: client,
// });

async function Page() {
  // const totalDonated = (await contract.read.getTotalDonations()) as
  //   | bigint
  //   | null;

  return <Main />;
}

export default Page;
