import { Hex, formatEther } from "viem";

export interface DonationResponse {
  eth_usd_price: number;
  donation_total: Hex;
}

export interface Donation {
  totalDonationInEth: bigint;
  totalDonationInUsd: number;
}

export async function getDonation(revalidate?: number) {
  const option: RequestInit = revalidate
    ? {
        method: "GET",
        next: { revalidate },
      }
    : {};
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/donation`, option)
    .then((res) => res.json() as Promise<DonationResponse>)
    .then((res) => {
      return parseDonationResponse(res);
    });
}

export function parseDonationResponse(response: DonationResponse): Donation {
  const totalDonationInEth = BigInt(response.donation_total);
  const usdPriceBigint = BigInt(Math.floor(response.eth_usd_price * 100));
  const totalDonationUSDBigInt =
    (totalDonationInEth * usdPriceBigint) / BigInt(100);
  const totalDonationInUsd = parseFloat(
    formatEther(totalDonationUSDBigInt)
  ).toFixed(2);

  return {
    totalDonationInEth,
    totalDonationInUsd: parseFloat(totalDonationInUsd),
  };
}
