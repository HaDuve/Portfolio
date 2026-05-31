import Script from "next/script";

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();

/** Google Ads gtag — loads only when NEXT_PUBLIC_GOOGLE_ADS_ID is set. */
export function GoogleAdsTag() {
  if (!googleAdsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}');
        `}
      </Script>
    </>
  );
}
