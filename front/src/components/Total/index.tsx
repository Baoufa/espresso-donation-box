import { useEffect, useState } from "react";
import classes from "./styles.module.css";
import { UpdateIcon } from "@radix-ui/react-icons";
import useContract from "@/hooks/useContract";
import { formatEther } from "viem";
import { Donation } from "@/hooks/useContract/service";

interface DonationPoolProps {
  toggleCurrency: () => void;
  style?: React.CSSProperties;
  className?: string;
}

enum Currency {
  USD = "USD",
  ETH = "ETH",
}

interface TotalProps {
  donation: Donation | null;
}

export default function Total({ donation }: TotalProps) {
  const [currency, setCurrency] = useState<Currency>(Currency.ETH);
  const { totalDonationsInEth, totalDonationsInUsd } = useContract();
  const [totalInETH, setTotalInETH] = useState<bigint | null>(
    donation && donation.totalDonationInEth
  );
  const [totalInUsd, setTotalInUsd] = useState<number | null>(
    donation && donation.totalDonationInUsd
  );

  function getReadableValue(value: bigint | null) {
    if (!value) return null;
    try {
      return parseFloat(formatEther(value)).toFixed(2);
    } catch (_) {
      console.log("error", _);
      return null;
    }
  }

  function toggleCurrency() {
    setCurrency(currency === Currency.ETH ? Currency.USD : Currency.ETH);
  }

  useEffect(() => {
    if (!totalDonationsInEth) return;
    setTotalInETH(totalDonationsInEth);
  }, [totalDonationsInEth]);

  useEffect(() => {
    if (!totalDonationsInUsd) return;
    setTotalInUsd(totalDonationsInUsd);
  }, [totalDonationsInUsd]);

  const readableTotalInETH = getReadableValue(totalInETH);

  if (!totalInUsd || !readableTotalInETH)
    return <div className={classes.placeholder} />;

  return (
    <div className={classes.container} onClick={toggleCurrency}>
      <div>Current donation pool</div>
      <div className={classes.active}>
        {currency === Currency.ETH
          ? `${Currency.ETH} ${readableTotalInETH}`
          : `${Currency.USD} ${totalInUsd}`}
      </div>
      <div className={classes.inactive}>
        <UpdateIcon />
        {currency === Currency.ETH
          ? `${Currency.USD} ${totalInUsd}`
          : `${Currency.ETH} ${readableTotalInETH}`}
      </div>
    </div>
  );
}
