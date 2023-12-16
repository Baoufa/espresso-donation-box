import { use, useEffect, useState } from "react";
import classes from "./styles.module.css";
import { UpdateIcon } from "@radix-ui/react-icons";
import useContract from "@/hooks/useContract";
import { formatEther, parseEther } from "viem";

interface DonationPoolProps {
  toggleCurrency: () => void;
  style?: React.CSSProperties;
  className?: string;
}

enum Currency {
  USD = "USD",
  ETH = "ETH",
}

export default function DonationPool({ className, style }: DonationPoolProps) {
  const [currency, setCurrency] = useState<Currency>(Currency.ETH);
  const { totalDonations } = useContract();
  const [totalInETH, setTotalInETH] = useState<bigint | null>(totalDonations);

  const totalInUSD = 5000;

  useEffect(() => {
    if (!totalDonations) return;
    setTotalInETH(totalDonations);
  }, [totalDonations]);

  useEffect(() => {
    console.log("totalDonations", totalDonations);
  }, [totalDonations]);

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

  const readableTotalInETH = getReadableValue(totalInETH);

  return (
    <div className={classes.container} onClick={toggleCurrency}>
      <div>Current donation pool</div>
      <div className={classes.active}>
        {currency === Currency.ETH
          ? `${Currency.ETH} ${readableTotalInETH}`
          : `${Currency.USD} ${totalInUSD}`}
      </div>
      <div className={classes.inactive}>
        <UpdateIcon />
        {currency === Currency.ETH
          ? `${Currency.USD} ${totalInUSD}`
          : `${Currency.ETH} ${readableTotalInETH}`}
      </div>
    </div>
  );
}
