"use client";

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
      className={className}
      lottieRef={lottieRef as any}
      animationData={animation}
      style={{
        width: "40vw",
        height: "40vw",
        minWidth: 400,
        minHeight: 400,
        zIndex: 0,
        ...style,
      }}
    />
  );
}
