"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { createLenisOptionsForMotion } from "@/lib/lenisMotionIntegration";
import "lenis/dist/lenis.css";

type Props = {
  children: React.ReactNode;
  enabled: boolean;
};

export function LenisProvider({ children, enabled }: Props) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={createLenisOptionsForMotion()} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
