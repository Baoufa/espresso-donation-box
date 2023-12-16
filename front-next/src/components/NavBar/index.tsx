"use client";

import classes from "./styles.module.css";
import { useAccount, useDisconnect } from "wagmi";
import logoDesktop from "@/assets/images/logo-desktop.svg";
import Image from "next/image";

export default function NavBar() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className={classes.navbar}>
      <Image src={logoDesktop} width={247} height={72} alt="espresso logo" />

      {address && disconnect && (
        <div className={classes.disconnect} onClick={() => disconnect()}>
          disconnect
        </div>
      )}
    </div>
  );
}
