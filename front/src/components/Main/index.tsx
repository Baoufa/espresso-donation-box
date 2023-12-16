"use client";

import AnimatedLogo from "../AnimatedLogo";
import classes from "./styles.module.css";
import Total from "../Total";
import DonationForm from "../DonationForm";
import { useAccount } from "wagmi";
import { Donation } from "@/hooks/useContract/service";

interface MainProps {
  donation: Donation | null;
}

export default function Main({ donation }: MainProps) {
  const { address } = useAccount();

  return (
    <main key={address || "reset-app-state"} className={classes.hero}>
      <div className={classes.inner}>
        <DonationForm />
        <AnimatedLogo className={classes.absolute} />
      </div>
      <Total donation={donation} />
    </main>
  );
}
