"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  buildSchedulingClickPayload,
  buildSchedulingHref,
  sendSchedulingClick,
  type SchedulingPlacement,
} from "@/lib/click-telemetry";
import { shouldInterceptForGoogleAdsConversion } from "@/lib/google-ads";
import type { Locale } from "@/lib/i18n";

type Props = {
  href: string;
  placement: SchedulingPlacement;
  locale: Locale;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function SchedulingLink({
  href,
  placement,
  locale,
  className,
  children,
  onClick,
}: Props) {
  const pathname = usePathname();
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const schedulingHref = buildSchedulingHref(href, path, placement);

  return (
    <a
      href={schedulingHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(event) => {
        sendSchedulingClick(
          buildSchedulingClickPayload(path, placement, locale),
        );
        onClick?.();

        const conversionEnabled =
          typeof window.gtag_report_conversion === "function";
        if (
          shouldInterceptForGoogleAdsConversion(event, conversionEnabled)
        ) {
          event.preventDefault();
          window.gtag_report_conversion!(schedulingHref, true);
        }
      }}
    >
      {children}
    </a>
  );
}
