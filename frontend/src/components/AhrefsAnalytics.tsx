import Script from "next/script";

const ahrefsKey = process.env.NEXT_PUBLIC_AHREFS_KEY?.trim();

/** Ahrefs Web Analytics — cookieless; loads only when NEXT_PUBLIC_AHREFS_KEY is set. */
export function AhrefsAnalytics() {
  if (!ahrefsKey) {
    return null;
  }

  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={ahrefsKey}
      strategy="afterInteractive"
    />
  );
}
