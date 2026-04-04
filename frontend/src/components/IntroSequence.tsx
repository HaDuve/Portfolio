"use client";

import gsap from "gsap";
import type { CSSProperties } from "react";
import { useLayoutEffect, useMemo, useRef } from "react";

type Props = {
  fullName: string;
  onComplete: () => void;
};

/** First letter of the first word + first letter of the last word (e.g. "Hannes Duve" → H, D). Single word uses first two characters; if only one character remains, duplicate it. */
function getNameInitials(fullName: string): { c1: string; c2: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return { c1: first, c2: last };
  }
  const only = parts[0] ?? "";
  return {
    c1: only[0] ?? "",
    c2: only[1] ?? "",
  };
}

function normalizeInitials(fullName: string): { c1: string; c2: string } {
  let { c1, c2 } = getNameInitials(fullName);
  if (!c2) c2 = c1;
  if (!c1) c1 = c2 || "?";
  if (!c2) c2 = c1;
  return { c1, c2 };
}

/** Shared with GSAP and inline styles so first paint matches animation (no layout flash). */
const LAYOUT = {
  bottomInset: "12vh",
  l1StartLeft: "70%",
  l2StartLeft: "82%",
  l1MeetLeft: "73%",
  l2MeetLeft: "77%",
  l1SplitLeft: "10%",
  l2SplitLeft: "90%",
  letterEnterY: 140,
  /** Midpoint of meet pair; animates to 50% with split. */
  logoMeetLeft: "75%",
  logoSplitLeft: "50%",
  logoScaleStart: 0.96,
} as const;

const meetEase = "power3.out";
const splitEase = "power2.inOut";

function letterInitialStyle(left: string): CSSProperties {
  return {
    position: "absolute",
    bottom: LAYOUT.bottomInset,
    left,
    opacity: 0,
    transform: `translateX(-50%) translateY(${LAYOUT.letterEnterY}px)`,
    margin: 0,
    padding: 0,
    willChange: "transform, opacity",
  };
}

const logoInitialStyle: CSSProperties = {
  position: "absolute",
  bottom: LAYOUT.bottomInset,
  left: LAYOUT.logoMeetLeft,
  top: "auto",
  opacity: 0,
  transform: `translateX(-50%) scale(${LAYOUT.logoScaleStart})`,
  willChange: "transform, opacity",
};

const rootOverlayStyle: CSSProperties = {
  backgroundColor: "var(--background, Canvas)",
};

export function IntroSequence({ fullName, onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const { c1, c2 } = useMemo(() => normalizeInitials(fullName), [fullName]);
  const monogram = `${c1}${c2}`.toUpperCase();

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    const root = rootRef.current;
    const l1 = l1Ref.current;
    const l2 = l2Ref.current;
    const logo = logoRef.current;
    if (!root || !l1 || !l2 || !logo) {
      onCompleteRef.current();
      return () => {
        document.body.style.overflow = "";
      };
    }

    const finish = () => onCompleteRef.current();

    const ctx = gsap.context(() => {
      gsap.set([l1, l2], {
        position: "absolute",
        bottom: LAYOUT.bottomInset,
        xPercent: -50,
        margin: 0,
        padding: 0,
        willChange: "transform,opacity",
      });

      gsap.set(l1, {
        left: LAYOUT.l1StartLeft,
        y: LAYOUT.letterEnterY,
        opacity: 0,
      });
      gsap.set(l2, {
        left: LAYOUT.l2StartLeft,
        y: LAYOUT.letterEnterY,
        opacity: 0,
      });

      gsap.set(logo, {
        position: "absolute",
        bottom: LAYOUT.bottomInset,
        left: LAYOUT.logoMeetLeft,
        top: "auto",
        xPercent: -50,
        y: 0,
        yPercent: 0,
        opacity: 0,
        scale: LAYOUT.logoScaleStart,
        willChange: "transform,opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finish,
      });

      tl.to(l1, {
        left: LAYOUT.l1MeetLeft,
        y: 0,
        opacity: 1,
        duration: 0.88,
        ease: meetEase,
      })
        .to(
          l2,
          {
            left: LAYOUT.l2MeetLeft,
            y: 0,
            opacity: 1,
            duration: 0.88,
            ease: meetEase,
          },
          "<0.06",
        )
        .to(
          l1,
          {
            left: LAYOUT.l1SplitLeft,
            duration: 1.05,
            ease: splitEase,
          },
          "+=0.12",
        )
        .to(
          l2,
          {
            left: LAYOUT.l2SplitLeft,
            duration: 1.05,
            ease: splitEase,
          },
          "<",
        )
        .to(
          logo,
          {
            left: LAYOUT.logoSplitLeft,
            duration: 1.05,
            ease: splitEase,
          },
          "<",
        )
        .to(
          logo,
          {
            opacity: 1,
            scale: 1,
            duration: 0.58,
            ease: "power2.out",
          },
          "-=0.35",
        )
        .to(root, {
          opacity: 0,
          duration: 0.68,
          ease: "power2.inOut",
        });
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [c1, c2]);

  const letterClass =
    "font-display text-[min(28vw,12rem)] font-normal leading-none text-foreground";

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto fixed inset-0 z-[100] bg-background"
      style={rootOverlayStyle}
      aria-hidden
    >
      <div className="relative h-full w-full">
        <div
          ref={l1Ref}
          className={letterClass}
          style={letterInitialStyle(LAYOUT.l1StartLeft)}
        >
          {c1}
        </div>
        <div
          ref={l2Ref}
          className={letterClass}
          style={letterInitialStyle(LAYOUT.l2StartLeft)}
        >
          {c2}
        </div>
        <div
          ref={logoRef}
          className="font-mono text-[clamp(2rem,8vw,3.5rem)] font-semibold tracking-tight text-foreground"
          style={logoInitialStyle}
        >
          {monogram}
        </div>
      </div>
    </div>
  );
}
