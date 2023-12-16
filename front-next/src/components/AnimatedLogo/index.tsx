"use client";

import classes from "./styles.module.css";
import { useRef } from "react";
import Lottie, { LottieRef } from "lottie-react";
import animation from "./lottie.json";

interface AnimatedLogoProps {
  style?: React.CSSProperties;
  className?: string;
}

export default function AnimatedLogo({ className, style }: AnimatedLogoProps) {
  const lottieRef = useRef<LottieRef>(null);

  return (
    <Lottie
      className={`${classes.animatedLogo} ${className}`}
      lottieRef={lottieRef as any}
      animationData={animation}
      style={style}
    />
  );
}
