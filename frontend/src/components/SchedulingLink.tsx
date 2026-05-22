"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  buildSchedulingClickPayload,
  sendSchedulingClick,
  type SchedulingPlacement,
} from "@/lib/click-telemetry";
import type { Locale } from "@/lib/i18n";

type Props = {
  href: string;
  placement: SchedulingPlacement;
  locale: Locale;
  className?: string;
  children: ReactNode;
};

export function SchedulingLink({
  href,
  placement,
  locale,
  className,
  children,
}: Props) {
  const pathname = usePathname();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
        sendSchedulingClick(
          buildSchedulingClickPayload(path, placement, locale),
        );
      }}
    >
      {children}
    </a>
  );
}
