"use client";

import gsap from "gsap";
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

const bottomInset = "12vh";
const meetEase = "power3.out";
const splitEase = "power2.inOut";

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
        bottom: bottomInset,
        xPercent: -50,
        margin: 0,
        padding: 0,
        willChange: "transform,opacity",
      });

      gsap.set(l1, {
        left: "70%",
        y: 140,
        opacity: 0,
      });
      gsap.set(l2, {
        left: "82%",
        y: 140,
        opacity: 0,
      });

      gsap.set(logo, {
        position: "absolute",
        left: "50%",
        top: "42%",
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.96,
        willChange: "transform,opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finish,
      });

      tl.to(l1, {
        left: "73%",
        y: 0,
        opacity: 1,
        duration: 0.88,
        ease: meetEase,
      })
        .to(
          l2,
          {
            left: "77%",
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
            left: "10%",
            duration: 1.05,
            ease: splitEase,
          },
          "+=0.12",
        )
        .to(
          l2,
          {
            left: "90%",
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
      aria-hidden
    >
      <div className="relative h-full w-full">
        <div ref={l1Ref} className={letterClass}>
          {c1}
        </div>
        <div ref={l2Ref} className={letterClass}>
          {c2}
        </div>
        <div
          ref={logoRef}
          className="font-mono text-[clamp(2rem,8vw,3.5rem)] font-semibold tracking-tight text-foreground"
        >
          {monogram}
        </div>
      </div>
    </div>
  );
}
