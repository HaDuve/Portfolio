"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type Props = {
  children: React.ReactNode;
  /** When true, starts Lenis. Leave false until Motion scroll + IO are integrated (Lenis can break whileInView). */
  enabled: boolean;
};

export function LenisProvider({ children, enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true });
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);

  return <>{children}</>;
}
