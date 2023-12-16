"use client";

import AnimatedLogo from "../AnimatedLogo";
import classes from "./styles.module.css";
import Total from "../Total";
import DonationForm from "../DonationForm";
import { useState } from "react";
import { useAccount } from "wagmi";

// interface HeroProps {
//   totalDonated: bigint | null;
// }

export default function Hero() {
  const [currency, setCurrency] = useState<"ETH" | "USD">("ETH");
  const { address } = useAccount();

  function toggleCurrency() {
    setCurrency(currency === "ETH" ? "USD" : "ETH");
  }

  return (
    <main key={address || "reset-app-state"} className={classes.hero}>
      <div className={classes.inner}>
        <DonationForm />
        <AnimatedLogo className={classes.absolute} />
      </div>
      <Total toggleCurrency={toggleCurrency} />
    </main>
  );
}
