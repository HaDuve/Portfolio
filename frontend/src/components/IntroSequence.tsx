"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

type Props = {
  fullName: string;
  onComplete: () => void;
};

export function IntroSequence({ fullName, onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const trimmed = fullName.trim();
  const c1 = trimmed[0] ?? "";
  const c2 = trimmed[1] ?? "";

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    const l1 = l1Ref.current;
    const l2 = l2Ref.current;
    if (!l1) {
      onCompleteRef.current();
      return () => {
        document.body.style.overflow = "";
      };
    }

    const finish = () => onCompleteRef.current();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finish,
      });

      if (c2 && l2) {
        tl.set([l1, l2], {
          opacity: 0,
          scale: 0.35,
          y: 100,
          rotation: 0,
          x: 0,
          filter: "blur(0px)",
        })
          .to([l1, l2], {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.14,
          })
          .to(
            l1,
            {
              x: "-32vw",
              y: "-22vh",
              rotation: -20,
              duration: 1.15,
            },
            "-=0.15",
          )
          .to(
            l2,
            {
              x: "30vw",
              y: "20vh",
              rotation: 18,
              duration: 1.15,
            },
            "<",
          )
          .to([l1, l2], {
            opacity: 0,
            scale: 1.6,
            filter: "blur(16px)",
            duration: 0.6,
            ease: "power2.in",
          });
      } else {
        tl.set(l1, { opacity: 0, scale: 0.4, y: 80 })
          .to(l1, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(l1, {
            x: "12vw",
            y: "-18vh",
            rotation: -8,
            duration: 1,
            ease: "power2.inOut",
          })
          .to(l1, {
            opacity: 0,
            scale: 1.4,
            filter: "blur(14px)",
            duration: 0.55,
            ease: "power2.in",
          });
      }
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [c1, c2]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      aria-hidden
    >
      <div className="pointer-events-none relative flex min-h-[40vh] w-full items-center justify-center gap-4 sm:gap-8">
        <div
          ref={l1Ref}
          className="font-display text-[min(28vw,12rem)] font-normal leading-none text-foreground"
        >
          {c1}
        </div>
        {c2 ? (
          <div
            ref={l2Ref}
            className="font-display text-[min(28vw,12rem)] font-normal leading-none text-foreground"
          >
            {c2}
          </div>
        ) : null}
      </div>
    </div>
  );
}
